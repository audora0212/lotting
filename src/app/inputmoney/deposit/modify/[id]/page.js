"use client";
// src/app/inputmoney/deposit/modify/[id]/page.js
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styles from "@/styles/DepositAdd.module.scss";

function DepositModifyPage() {
  const pathname = usePathname();
  const userId = pathname.split("/")[4]; // URL에서 ID 추출

  const [tableData, setTableData] = useState([
    {
      거래일시: "2023-01-01 12:00",
      적요: "입금",
      기재내용: "월급",
      계약자: "홍길동",
      찾으신금액: "0",
      맡기신금액: "500,000",
      거래후잔액: "1,000,000",
      취급점: "서울지점",
      계좌: "123-456-789",
    },
  ]);

  const handleInputChange = (e, rowIndex, fieldName) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][fieldName] = e.target.value;
    setTableData(updatedData);
  };

  const handleSave = () => {
    console.log("수정된 데이터:", tableData);
    alert("데이터가 저장되었습니다.");
  };

  return (
    <div className={styles.container}>
      <p></p>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>관리번호</span>
          </div>
          <div className={styles.contentbody}>
            <span>{userId || "."}</span>
          </div>
        </div>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>성명</span>
          </div>
          <div className={styles.contentbody}>
            <span>{tableData[0]?.계약자 || "."}</span>
          </div>
        </div>
      </div>

      <h3>현재 입금내역</h3>
      <p></p>
      <div className={styles.tableWrapper}>
        {/* 테이블 헤더 */}
        <div className={styles.tablecontainer}>
          <div className={styles.unitContainer}>거래일시</div>
          <div className={styles.unitContainer}>적요</div>
          <div className={styles.unitContainer}>기재내용</div>
          <div className={styles.unitContainer}>계약자</div>
          <div className={styles.unitContainer}>찾으신 금액</div>
          <div className={styles.unitContainer}>맡기신 금액</div>
          <div className={styles.unitContainer}>거래 후 잔액</div>
          <div className={styles.unitContainer}>취급점</div>
          <div className={styles.unitContainer}>계좌</div>
        </div>

        {/* 테이블 바디 */}
        {tableData.map((row, rowIndex) => (
          <div className={styles.rowContainer} key={rowIndex}>
            {Object.keys(row).map((key, colIndex) => (
              <div key={colIndex} className={styles.unitContainer}>
                <input
                  type="text"
                  value={row[key]}
                  onChange={(e) => handleInputChange(e, rowIndex, key)}
                  className={styles.inputBox} // 커스텀 스타일 적용
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <p></p>
      <div className={styles.buttonContainer}>
        <button className={styles.contractButton} onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  );
}

export default DepositModifyPage;
