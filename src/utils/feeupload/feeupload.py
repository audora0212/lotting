import openpyxl
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
import os
print("Current working directory:", os.getcwd())
# SQLAlchemy 기본 클래스 생성
Base = declarative_base()

# Fee 모델 (부모)
class Fee(Base):
    __tablename__ = 'fee'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    groupname = Column(String)       # 군
    floor = Column(String)           # 층
    batch = Column(String)           # 가입차순 (고정 '2차')
    type = Column(String)            # 타입
    supplyarea = Column(Float)       # 공급면적
    priceperp = Column(Float)        # 평당가
    price = Column(Float)            # 금액
    paymentratio = Column(Float)     # 납입비율
    paysum = Column(Float)           # 합계

    feePerPhases = relationship("FeePerPhase", back_populates="fee", cascade="all, delete-orphan")

# FeePerPhase 모델 (자식)
class FeePerPhase(Base):
    __tablename__ = 'fee_per_phase'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    phase_number = Column(Integer)    # n차
    phasefee = Column(Float)         # 각 단계별 금액
    phasedate = Column(String)       # 제출일 (문자열 그대로 저장)
    
    fee_id = Column(Integer, ForeignKey('fee.id'))
    fee = relationship("Fee", back_populates="feePerPhases")

# MySQL RDS 접속 문자열 (아래 값을 실제 RDS 접속정보로 교체)
# 형식: "mysql+pymysql://username:password@rds_host:3306/database_name"
engine = create_engine('mysql+pymysql://audora:dudcks!1@database-1.c1u2q4ggekd3.ap-northeast-2.rds.amazonaws.com:3306/lottingdb', echo=True)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

def read_excel_and_insert(excel_path, session):
    # Excel 파일 읽기 (수식 결과가 아닌 실제 값 사용)
    workbook = openpyxl.load_workbook(excel_path, data_only=True)
    sheet = workbook.active

    # 각 단계의 날짜는 고정 셀에서 가져옴 (단, 1차~3차는 별도 처리)
    phase_dates = {
        1: sheet['J5'].value,  # 기본값이지만 실제로는 사용하지 않음
        2: sheet['K5'].value,  # 기본값이지만 실제로는 사용하지 않음
        3: sheet['L6'].value,  # 기본값이지만 실제로는 사용하지 않음
        4: sheet['M6'].value,  # 4차
        5: sheet['N6'].value,  # 5차
        6: sheet['O6'].value,  # 6차
        7: sheet['P6'].value,  # 7차
        8: sheet['Q6'].value,  # 8차
        9: sheet['R6'].value,  # 9차
    }
    
    # 실제 데이터가 있는 행 번호
    data_rows = [7, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33]
    
    try:
        for row in data_rows:
            # Fee 엔티티 매핑
            groupname = sheet[f'A{row}'].value
            floor = sheet[f'B{row}'].value
            type_ = sheet[f'C{row}'].value
            supplyarea = sheet[f'D{row}'].value
            priceperp = sheet[f'G{row}'].value
            price = sheet[f'H{row}'].value
            paysum = sheet[f'S{row}'].value
            paymentratio = sheet[f'T{row}'].value
            batch = '2차'  # 고정값
            
            # 필수 데이터 누락 체크
            if (groupname is None or floor is None or type_ is None or 
                supplyarea is None or priceperp is None or price is None or 
                paysum is None or paymentratio is None):
                raise ValueError(f"Row {row}에 필수 데이터가 누락되었습니다.")
            
            try:
                supplyarea = float(supplyarea)
                priceperp = float(priceperp)
                price = float(price)
                paysum = float(paysum)
                paymentratio = float(paymentratio)
            except Exception as e:
                raise ValueError(f"Row {row}의 숫자형 데이터 변환 실패: {e}")
            
            fee = Fee(
                groupname=groupname,
                floor=floor,
                type=type_,
                supplyarea=supplyarea,
                priceperp=priceperp,
                price=price,
                paysum=paysum,
                paymentratio=paymentratio,
                batch=batch
            )
            
            # 각 단계별 phasefee 읽기 (열 매핑: J~R)
            phase_columns = {1: 'J', 2: 'K', 3: 'L', 4: 'M', 5: 'N', 6: 'O', 7: 'P', 8: 'Q', 9: 'R'}
            fee.feePerPhases = []
            
            for phase in range(1, 10):
                col_letter = phase_columns[phase]
                cell_value = sheet[f'{col_letter}{row}'].value
                if cell_value is None:
                    raise ValueError(f"Row {row}의 {phase}차 phasefee 데이터가 누락되었습니다.")
                try:
                    # 천원 단위이므로 실제 저장 시 1000을 곱해준다.
                    phasefee = float(cell_value) * 1000
                except Exception as e:
                    raise ValueError(f"Row {row}의 {phase}차 phasefee 숫자 변환 실패: {e}")
                
                # 1차, 2차, 3차는 각각 "0달", "1달", "2달"을 사용
                if phase == 1:
                    phasedate = "0달"
                elif phase == 2:
                    phasedate = "1달"
                elif phase == 3:
                    phasedate = "2달"
                else:
                    phasedate = phase_dates[phase]
                    if phasedate is None:
                        raise ValueError(f"{phase}차의 phasedate 값이 누락되었습니다.")
                
                fee_per_phase = FeePerPhase(
                    phase_number=phase,
                    phasefee=phasefee,
                    phasedate=str(phasedate)
                )
                fee.feePerPhases.append(fee_per_phase)
            
            session.add(fee)
        
        # 모든 데이터가 올바르면 커밋
        session.commit()
        print("모든 데이터가 성공적으로 삽입되었습니다.")
        
    except Exception as e:
        session.rollback()
        print("데이터 삽입 도중 에러가 발생하여 중단합니다:", e)

if __name__ == '__main__':
    excel_path = "C:/Users/gy255/OneDrive/바탕 화면/lottingset/lotting/src/utils/feeupload/data.xlsx"
    read_excel_and_insert(excel_path, session)
