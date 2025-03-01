// src/app/inputmoney/deposit/loan/[id]/page.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPendingPhases, fetchLoanInit } from "@/utils/api";
import styles from "@/styles/DepositAdd.module.scss";
import { useRecoilValueLoadable } from "recoil";
import { userinfoSelector } from "@/utils/selector";
import Swal from "sweetalert2";

const LoanApplyDetail = ({ params }) => {
  const router = useRouter();
  const { id } = params; // URL에서 회원 ID 가져오기

  // ✅ Recoil 상태 불러오기 (컴포넌트 내부에서 호출)
  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  // ✅ 상태 저장 (useState 활용)
  const [userInfo, setUserInfo] = useState(null);

  // ✅ 사용자 정보 불러오기 (useEffect 활용)
  useEffect(() => {
    if (userselectordata.state === "hasValue") {
      setUserInfo(userselectordata.contents);
    }
  }, [userselectordata]); // userselectordata 변경될 때 실행

  // ✅ 대출 관련 상태
  const [loanAmount, setLoanAmount] = useState(0);
  const [selfAmount, setSelfAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        console.log("📌 fetchLoanInit 호출됨, id:", id);
        const loanData = await fetchLoanInit(id);
        console.log("✅ 대출 데이터 불러오기 성공:", loanData);

        setLoanAmount(loanData.loanammount || 0);
        setSelfAmount(loanData.selfammount || 0);
        setTotalAmount((loanData.loanammount || 0) + (loanData.selfammount || 0));
      } catch (error) {
        console.error("❌ Error fetching loan data:", error);
      }
    };

    if (id) {
      fetchLoanData();
    }
  }, [id]);

  // ✅ 진행 예정 납부 차수 목록
  const [pendingPhases, setPendingPhases] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
// ✅ totalAmount가 변경될 때 remainingAmount 업데이트
useEffect(() => {
    setRemainingAmount(totalAmount);
  }, [totalAmount]); // totalAmount 변경될 때 실행
  // ✅ 진행 예정 납부 차수 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchPendingPhases(id);
        console.log("📌 진행 예정 납부 차수 데이터:", fetchedData);
        setPendingPhases(fetchedData || []);
      } catch (error) {
        console.error("❌ Error fetching pending phases:", error);
        setPendingPhases([]);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // ✅ 체크박스 선택 핸들러 (차수 선택/해제 시 남은 금액 업데이트)
  const handleCheckboxChange = (phase) => {
    const phaseAmount = phase.feesum ?? 0;

    if (selectedPhases.includes(phase.phaseNumber)) {
      // 선택 해제 (남은 금액 증가)
      setSelectedPhases(selectedPhases.filter((num) => num !== phase.phaseNumber));
      setRemainingAmount(remainingAmount + phaseAmount);
    } else {
      // 선택 (남은 금액이 충분한 경우만 가능)
      if (remainingAmount >= phaseAmount) {
        setSelectedPhases([...selectedPhases, phase.phaseNumber]);
        setRemainingAmount(remainingAmount - phaseAmount);
      } else {
        Swal.fire({
          icon: "warning",
          title: "선택 불가",
          text: "남은 금액이 부족하여 선택할 수 없습니다.",
        });
      }
    }
  };

  // ✅ 선택한 차수 정보 적용 버튼 클릭
  const handleApply = () => {
    if (selectedPhases.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "차수 선택 필요",
        text: "적용할 차수를 선택해주세요.",
      });
      return;
    }

    console.log("✅ 선택된 차수:", selectedPhases);
    console.log("📌 적용할 대출금:", loanAmount);
    console.log("📌 적용할 자납금:", selfAmount);
    console.log("📌 합계 금액:", totalAmount);
    console.log("📉 남은 금액:", remainingAmount);

    // 여기에 선택한 차수를 백엔드에 저장하는 API 호출 로직 추가 가능
  };
  return (
    <div>
    <p></p>
        <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
            <div className={styles.titlebody}>
            <span className={styles.title}>관리번호</span>
            </div>
            <div className={styles.contentbody}>
            {userInfo?.id || "정보 없음"}
            </div>
        </div>
        <div className={styles.unitbody}>
            <div className={styles.titlebody}>
            <span className={styles.title}>성명</span>
            </div>
            <div className={styles.contentbody}>
            {userInfo?.customerData?.name || "정보 없음"}
            </div>
        </div>
        </div>
      <p></p>
      <h2>대출/자납액 정보</h2>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>대출액</span>
          </div>
          <div className={styles.contentbody}>
          {loanAmount.toLocaleString()}₩
          </div>
        </div>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>자납액</span>
          </div>
          <div className={styles.contentbody}>
          {selfAmount.toLocaleString()}₩
          </div>
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>합계</span>
          </div>
          <div className={styles.contentbody}>
          {totalAmount.toLocaleString()}₩
          </div>
        </div>
      </div>

      <h2>📌 진행 예정 납부 차수 선택</h2>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>합계</span>
          </div>
          <div className={styles.contentbody}>
          <p>💰 남은 금액: <strong>{remainingAmount.toLocaleString()}₩</strong></p>
          </div>
        </div>
      </div>
      

      {pendingPhases.length > 0 ? (
  <ul>
    {pendingPhases.map((phase) => {
      const phaseAmount = phase.feesum ?? 0;
      const isSelected = selectedPhases.includes(phase.phaseNumber);
      const isDisabled = remainingAmount < phaseAmount && !isSelected;

      return (
        <li key={phase.phaseNumber}>
          <div className={styles.infoContainer}>
            <div className={styles.unitbody}>
              <div className={styles.titlebody}>
                <span className={styles.phaseTitle}>{phase.phaseNumber}차 총액</span>
              </div>
              <div
                className={`${styles.contentbody2} 
                            ${isSelected ? styles.selected : ""}
                            ${isDisabled ? styles.disabledPhase : ""}`}
                onClick={() => !isDisabled && handleCheckboxChange(phase)}
              >
                <div className={styles.phaseAmount}>
                  {phaseAmount.toLocaleString()}₩
                </div>
              </div>
            </div>
          </div>
        </li>
      );
    })}
  </ul>
) : (
  <p>진행 예정 납부 차수가 없습니다.</p>
)}

    <p></p>
      <button className={styles.contractButton}
        onClick={handleApply}
      >
        선택한 차수 적용하기
      </button>
    </div>
  );
};

export default LoanApplyDetail;
