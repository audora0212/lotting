"use client";
// src/app/inputmoney/deposit/[id]/page.js
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "@/styles/DepositAdd.module.scss";
import { InputboxGray } from "@/components/Inputbox";
import Link from "next/link";
import {
  fetchDepositHistoriesByCustomerId,
  createDepositHistory,
  fetchPendingPhases,
  fetchCustomerById, // ✅ 올바른 import 추가
  deleteDepositHistory,
} from "@/utils/api";

function DepositPage() {
  // URL 파라미터를 안전하게 추출 (뒤로가기 시에도 올바른 값을 얻을 수 있음)
  const { id: userId } = useParams();

  // 대출 기록 여부 상태
  const [isLoanRecord, setIsLoanRecord] = useState(false);

  // 고객의 Status.loanExceedAmount 값을 저장할 상태
  const [statusLoanExceed, setStatusLoanExceed] = useState(0);

  const [formData, setFormData] = useState({
    transactionDateTime: "",
    remarks: "",
    details: "",
    contractor: "",
    withdrawnAmount: "",
    depositAmount: "",
    balanceAfter: "",
    branch: "",
    account: "",
    customer: { id: userId },
    loanDate: "", // loanDetails.loandate → loanDate로 변경
    loanDetails: {
      loanbank: "",
      loanammount: "",
      selfPaymentDate: "", // loanDetails.selfdate → selfPaymentDate로 변경
      selfammount: "",
      loanselfsum: "",
      loanselfcurrent: "",
    },
    targetPhases: [],
  });

  const [depositData, setDepositData] = useState([]);
  const [pendingPhases, setPendingPhases] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);

  // 고객별 입금내역 페칭
  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const data = await fetchDepositHistoriesByCustomerId(userId);
        setDepositData(data);
      } catch (error) {
        console.error("Error fetching deposits:", error);
        setDepositData([]);
      }
    };
    if (userId) {
      loadDeposits();
    }
  }, [userId]);

  // 대출 기록 체크 시 납입 예정 차수 및 고객의 Status.loanExceedAmount 페칭  
  // fetchCustomerById를 사용하여 전체 Customer 객체에서 Status 필드를 읽어옵니다.
  useEffect(() => {
    const loadPendingPhases = async () => {
      try {
        const data = await fetchPendingPhases(userId);
        setPendingPhases(data || []);
      } catch (error) {
        console.error("Error fetching pending phases:", error);
        setPendingPhases([]);
      }
    };
    const loadCustomerData = async () => {
      try {
        const customerData = await fetchCustomerById(userId);  // ✅ 올바른 API 호출
        console.log("Fetched Customer Data:", customerData);
        setFormData((prev) => ({
          ...prev,
          contractor: customerData.customerData?.name || customerData.name || "", 
        }));
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    
    if (userId) {
      loadCustomerData();
      if (isLoanRecord) {
        loadPendingPhases();
      }
    }
    
  }, [userId, isLoanRecord]);

  // 선택된 차수 업데이트 시 formData.targetPhases 동기화
  useEffect(() => {
    setFormData((prev) => ({ ...prev, targetPhases: selectedPhases }));
  }, [selectedPhases]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "loanDate" || name === "selfPaymentDate") {
      // loanDate와 selfPaymentDate는 최상위 필드이므로 따로 처리
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  // 계산: 대출액 + 자납액
  const computedDeposit =
    (Number(formData.loanDetails.loanammount) || 0) +
    (Number(formData.loanDetails.selfammount) || 0);
  // 선택된 납입 차수 총액 (pendingPhases에서 feesum)
  const selectedPhasesSum = pendingPhases
    .filter((phase) => selectedPhases.includes(phase.phaseNumber))
    .reduce((acc, phase) => acc + (phase.feesum || 0), 0);
  // 대출 잔액 = computedDeposit - 선택된 차수 합계 + statusLoanExceed, 음수면 0
  const computedLoanBalance = Math.max(
    0,
    computedDeposit - selectedPhasesSum + statusLoanExceed
  );
  const [remainingAmount, setRemainingAmount] = useState(0);

  // totalAmount가 변경될 때 remainingAmount 업데이트
  useEffect(() => {
    setRemainingAmount(computedDeposit);
  }, [computedDeposit]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitData = { ...formData };

    console.log("📌 최종 전송 데이터:", JSON.stringify(submitData, null, 2));
  
    // ✅ loanDate 및 selfPaymentDate 추가
    submitData.loanDate = formData.loanDate;
    submitData.loanDetails.selfPaymentDate = formData.loanDetails.selfPaymentDate;

    // 선택된 차수를 반영
    submitData.targetPhases = selectedPhases;

    if (isLoanRecord) {
      submitData.withdrawnAmount = "0";
      submitData.depositAmount = computedDeposit.toString();
      submitData.loanDetails.loanselfsum = computedDeposit.toString();
      submitData.loanDetails.loanselfcurrent = computedLoanBalance.toString();
      submitData.loanStatus = "o";
    }
  
    try {
      await createDepositHistory(submitData);
      alert("데이터가 성공적으로 저장되었습니다.");
      setDepositData(await fetchDepositHistoriesByCustomerId(userId));
    } catch (error) {
      console.error("Error creating deposit history:", error);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  const handleLoanAlert = () => {
    alert("대출 기록은 수정할 수 없습니다. 삭제 후 재입력해주세요.");
  };

  // 단순 토글: 납입 차수 선택/해제
  const togglePhase = (phaseNumber) => {
    setSelectedPhases((prev) =>
      prev.includes(phaseNumber)
        ? prev.filter((num) => num !== phaseNumber)
        : [...prev, phaseNumber]
    );
  };

  // 배열을 n개씩 묶는 헬퍼 (한 줄에 3개씩)
  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // 삭제 기능 핸들러
  const handleDelete = async (depositId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDepositHistory(depositId);
        alert("삭제되었습니다.");
        const updatedDeposits = await fetchDepositHistoriesByCustomerId(userId);
        setDepositData(updatedDeposits);
      } catch (error) {
        console.error("Error deleting deposit history:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handlePhaseSelection = (phase) => {
    const phaseAmount = phase.feesum ?? 0;
  
    if (selectedPhases.includes(phase.phaseNumber)) {
      setSelectedPhases(selectedPhases.filter((num) => num !== phase.phaseNumber));
    } else {
      setSelectedPhases([...selectedPhases, phase.phaseNumber]);
    }
  };
  
  return (
    <div className={styles.container}>
      <p></p>

      <h2>기업 입금내역 추가</h2>
      <p></p>
      <p></p>
      <form onSubmit={handleSubmit}>
        {/* 상단 입력란: 거래일시, 적요, 기재내용 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래일시</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="datetime-local"
                name="transactionDateTime"
                value={formData.transactionDateTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>적요</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>기재내용</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* 중단 입력란: 계약자, 찾으신 금액 (대출 기록 시 숨김), 맡기신 금액 (대출 기록이면 계산값) */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>계약자</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="contractor"
                value={formData.contractor}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {!isLoanRecord && (
            <div className={styles.unitbody}>
              <div className={styles.titlebody}>
                <label className={styles.title}>찾으신 금액</label>
              </div>
              <div className={styles.contentbody}>
                <InputboxGray
                  type="number"
                  name="withdrawnAmount"
                  value={formData.withdrawnAmount}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>
                {isLoanRecord ? "대출액+자납액" : "맡기신 금액"}
              </label>
            </div>
            <div className={styles.contentbody}>
              {isLoanRecord ? (
                <InputboxGray
                  type="number"
                  name="depositAmount"
                  value={computedDeposit}
                  disabled
                />
              ) : (
                <InputboxGray
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* 하단 입력란: 거래 후 잔액, 취급점, 계좌 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래 후 잔액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="number"
                name="balanceAfter"
                value={formData.balanceAfter}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>취급점</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>계좌</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="account"
                value={formData.account}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>



        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.contractButton}>
            추가하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepositPage;
