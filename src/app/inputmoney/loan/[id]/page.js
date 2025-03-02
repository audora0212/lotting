"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import styles from "@/styles/DepositAdd.module.scss";
import { InputboxGray } from "@/components/Inputbox";
import { fetchCustomerById, fetchLoanUpdate } from "@/utils/api";

// 날짜 포맷팅 헬퍼 함수: "yyyy-MM-dd" 형태의 값에 시간 정보를 추가해 "yyyy-MM-ddT00:00" 형태로 반환
const formatDateTimeLocal = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("T")) return dateStr;
  return dateStr + "T00:00";
};

// 숫자 입력값에 대해 실시간 포맷팅 (콤마 추가)
const handleMoneyChange = (e, setLoanData) => {
  const { name, value } = e.target;
  const numeric = value.replace(/\D/g, "");
  const formatted = numeric ? parseInt(numeric, 10).toLocaleString() : "";
  setLoanData((prev) => ({ ...prev, [name]: formatted }));
};

function LoanUpdatePage() {
  const { id: userId } = useParams();

  const [loanData, setLoanData] = useState({
    loandate: "",
    loanbank: "",
    loanammount: "",
    selfdate: "",
    selfammount: "",
  });
  const [initialLoanData, setInitialLoanData] = useState(null);
  const [statusLoanExceed, setStatusLoanExceed] = useState("");

  useEffect(() => {
    if (userId) {
      fetchCustomerById(userId)
        .then((customerData) => {
          if (customerData.loan) {
            const fetchedLoanData = {
              loandate: formatDateTimeLocal(customerData.loan.loandate || ""),
              loanbank: customerData.loan.loanbank || "",
              loanammount: customerData.loan.loanammount
                ? customerData.loan.loanammount.toString()
                : "",
              selfdate: formatDateTimeLocal(customerData.loan.selfdate || ""),
              selfammount: customerData.loan.selfammount
                ? customerData.loan.selfammount.toString()
                : "",
            };
            setLoanData(fetchedLoanData);
            setInitialLoanData(fetchedLoanData);
          }
          if (
            customerData.status &&
            customerData.status.loanExceedAmount != null
          ) {
            setStatusLoanExceed(customerData.status.loanExceedAmount.toString());
          }
        })
        .catch((error) => {
          console.error("Error fetching customer data:", error);
        });
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoanData((prev) => ({ ...prev, [name]: value }));
  };

  // 현재 대출/자납 총액: 초기(저장된) 데이터 기준
  const currentLoanTotal = initialLoanData
    ? (Number(initialLoanData.loanammount.replace(/,/g, "")) || 0) +
      (Number(initialLoanData.selfammount.replace(/,/g, "")) || 0)
    : 0;

  // 예상 대출/자납 총액: 현재 입력된 값
  const expectedLoanTotal =
    (Number(loanData.loanammount.replace(/,/g, "")) || 0) +
    (Number(loanData.selfammount.replace(/,/g, "")) || 0);

  // 현재 대출/자납 잔액: 고객의 대출초과액 (DB에 저장된 값)
  const currentLoanBalance = statusLoanExceed ? Number(statusLoanExceed) : 0;
  // 예상 대출/자납 잔액: 고객의 대출초과액에서 예상 총액 차감 (음수면 0)
  const expectedLoanBalance = Math.max(0, currentLoanBalance - expectedLoanTotal);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanData.loandate || !loanData.loanbank || !loanData.loanammount) {
      Swal.fire({
        icon: "warning",
        title: "필수 입력값 누락",
        text: "대출일자, 대출은행, 대출액은 필수 입력값입니다.",
      });
      return;
    }

    const updatedLoan = {
      loandate: loanData.loandate,
      loanbank: loanData.loanbank,
      loanammount: Number(loanData.loanammount.replace(/,/g, "")),
      selfdate: loanData.selfdate,
      selfammount: Number(loanData.selfammount.replace(/,/g, "")),
    };

    try {
      await fetchLoanUpdate(userId, updatedLoan, () => {});
      Swal.fire({
        icon: "success",
        title: "수정 완료",
        text: "대출/자납 정보가 성공적으로 수정되었습니다.",
      });
      const customerData = await fetchCustomerById(userId);
      if (
        customerData.status &&
        customerData.status.loanExceedAmount != null
      ) {
        setStatusLoanExceed(customerData.status.loanExceedAmount.toString());
      }
    } catch (error) {
      console.error("Error updating loan data:", error);
      Swal.fire({
        icon: "error",
        title: "수정 실패",
        text: "대출/자납 정보 수정에 실패했습니다.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2>대출/자납 정보 수정</h2>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>관리번호</span>
          </div>
          <div className={styles.contentbody}>
            <span>{userId || "N/A"}</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* 첫 번째 행: 대출일자 / 대출액 / 대출은행 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>대출일자</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="datetime-local"
                name="loandate"
                value={loanData.loandate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>대출액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="loanammount"
                value={loanData.loanammount}
                onChange={(e) => handleMoneyChange(e, setLoanData)}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>대출은행</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="loanbank"
                value={loanData.loanbank}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        {/* 두 번째 행: 자납일 / 자납액 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>자납일</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="datetime-local"
                name="selfdate"
                value={loanData.selfdate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>자납액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="selfammount"
                value={loanData.selfammount}
                onChange={(e) => handleMoneyChange(e, setLoanData)}
              />
            </div>
          </div>
        </div>
        {/* 현재/예상 대출/자납 정보 표기 (수정하기 버튼 바로 위) */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <span className={styles.title}>현재 대출/자납 총액</span>
            </div>
            <div className={styles.contentbody}>
              <span>{currentLoanTotal.toLocaleString()}₩</span>
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <span className={styles.title}>현재 대출/자납 잔액</span>
            </div>
            <div className={styles.contentbody}>
              <span>{currentLoanBalance.toLocaleString()}₩</span>
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <span className={styles.title}>예상 대출/자납 총액</span>
            </div>
            <div className={styles.contentbody}>
              <span>{expectedLoanTotal.toLocaleString()}₩</span>
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <span className={styles.title}>예상 대출/자납 잔액</span>
            </div>
            <div className={styles.contentbody}>
              <span>{expectedLoanBalance.toLocaleString()}₩</span>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.contractButton}>
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoanUpdatePage;
