"use client";
import React, { useEffect, useState } from "react";
import {
  fetchContractedCustomers,
  fetchFullyPaidCustomers,
  getPhaseSummaries,
} from "@/utils/api";
import { BsBagDash, BsDatabase } from "react-icons/bs";
import { BiGroup } from "react-icons/bi";
import ContractSummary from "@/components/Dashboard/ContractSummary";
import ContractAmount from "@/components/Dashboard/ContrachAmmount";
import ClientList from "@/components/Dashboard/ClientList";
import InstallmentAmounts from "@/components/Dashboard/InstallmentAmounts";
import styles from "../../styles/Dashboard.module.scss";

const Dashboard = () => {
  const [contractedCount, setContractedCount] = useState("loading...");
  const [fullyPaidCount, setFullyPaidCount] = useState("loading...");

  // 계약금액, 확입금액
  const [contractAmount, setContractAmount] = useState("loading...");
  const [confirmDepositAmount, setConfirmDepositAmount] = useState("loading...");

  // (추가) 차수별 요약 데이터 & 로딩 상태
  const [phaseSummaries, setPhaseSummaries] = useState([]);
  const [phaseLoading, setPhaseLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // 한 번에 모두 호출
        const [contracted, fullyPaid, summary] = await Promise.all([
          fetchContractedCustomers(),
          fetchFullyPaidCustomers(),
          getPhaseSummaries(), // /phase-summary
        ]);

        // 정계약 / 완납
        setContractedCount(contracted);
        setFullyPaidCount(fullyPaid);

        // 차수별 요약
        setPhaseSummaries(summary);
        setPhaseLoading(false);

        // 총 납입액, 총 미납액
        const totalDeposited = summary.reduce(
          (acc, cur) => acc + (cur.totalDeposited || 0),
          0
        );
        const totalUnpaid = summary.reduce(
          (acc, cur) => acc + (cur.totalUnpaid || 0),
          0
        );

        // 계약금액(= 납입 + 미납), 확입금액(= 납입만)
        setContractAmount(totalDeposited + totalUnpaid);
        setConfirmDepositAmount(totalDeposited);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // 숫자 → '1,234 ₩' 형식 변환 (JS 전용)
  const formatWon = (value) => {
    if (typeof value === "number") {
      return value.toLocaleString() + " ₩";
    }
    return value; // "loading..." 등 문자열 그대로
  };

  // 임시 미납자 목록
  const clients = [
    { id: "123455", name: "이승준", lastPayment: "4차", tempDong: "84A-사-1" },
    { id: "123456", name: "김철수", lastPayment: "3차", tempDong: "84B-사-2" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.MainTitle}>
        <div className={styles.TwoColumnContainer}>
          {/* 왼쪽 컬럼 */}
          <div className={styles.LeftColumn}>
            {/* 계약건수 & 완납인원 */}
            <div className={styles.Row}>
              <ContractSummary
                icon={<BsBagDash style={{ width: "100%", height: "100%" }} />}
                color="#7152F3"
                name="현재 계약건수"
                value={contractedCount}
                percentage="1"
                updatedDate="2024년 11월 20일"
              />
              <ContractSummary
                icon={<BiGroup style={{ width: "100%", height: "100%" }} />}
                color="#7152F3"
                name="완납인원"
                value={fullyPaidCount}
                percentage="0"
                updatedDate="2024년 11월 20일"
              />
            </div>

            {/* 계약금액 & 확입금액 */}
            <div className={styles.Row}>
              <ContractAmount
                icon={<BsDatabase style={{ width: "100%", height: "100%" }} />}
                color="#7152F3"
                name="계약금액"
                amount={formatWon(contractAmount)}
                updatedDate="2024년 11월 20일"
              />
              <ContractAmount
                icon={<BsDatabase style={{ width: "100%", height: "100%" }} />}
                color="#7152F3"
                name="확입금액"
                amount={formatWon(confirmDepositAmount)}
                updatedDate="2024년 11월 20일"
              />
            </div>

            {/* 미납자 명단 */}
            <div className={styles.Row}>
              <ClientList clients={clients} />
            </div>

            {/* 공지사항 */}
            <div className={styles.Row}>
              <div className={styles.Notice}>
                <div className={styles.NoticeTitle}>공지사항</div>
                <div className={styles.NoticeContent}>
                  [임시공지사항] 시스템 점검 예정
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 차수별 납입/미납 금액 */}
          <div className={styles.RightColumn}>
            {/* InstallmentAmounts에 props로 전달 */}
            <InstallmentAmounts
              phaseSummaries={phaseSummaries}
              loading={phaseLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
