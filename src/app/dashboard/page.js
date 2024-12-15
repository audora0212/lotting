'use client'
import React, { useEffect, useState } from "react";
import { BsBagDash, BsDatabase } from "react-icons/bs";
import { BiGroup } from "react-icons/bi";
import ContractSummary from "@/components/Dashboard/ContractSummary";
import ContractAmount from "@/components/Dashboard/ContrachAmmount";
import ClientList from "@/components/Dashboard/ClientList";
import { fetchContractedCustomers, fetchFullyPaidCustomers } from "@/utils/api";
import styles from "../../styles/Dashboard.module.scss";

const Dashboard = () => {
  const [contractedCount, setContractedCount] = useState(0);
  const [fullyPaidCount, setFullyPaidCount] = useState(0);
  const clients = [
    { id: "123455", name: "이승준", lastPayment: "4차", tempDong: "84A-사-1" },
    { id: "123456", name: "김철수", lastPayment: "3차", tempDong: "84B-사-2" },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [contracted, fullyPaid] = await Promise.all([
          fetchContractedCustomers(),
          fetchFullyPaidCustomers(),
        ]);
        setContractedCount(contracted);
        setFullyPaidCount(fullyPaid);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.MainTitle}>
        <div className={styles.Row}>
          <ContractSummary
            icon={<BsBagDash style={{ width: "100%", height: "100%" }} />}
            color="#7152F3"
            name="현재 계약건수"
            value={contractedCount}
            percentage="12"
            updatedDate="2024년 11월 20일"
          />
          <ContractSummary
            icon={<BiGroup style={{ width: "100%", height: "100%" }} />}
            color="#7152F3"
            name="완납인원"
            value={fullyPaidCount}
            percentage="5"
            updatedDate="2024년 11월 20일"
          />
          <div className={styles.Schedule}>
            <div className={styles.ScheduleTitle}>일정관리</div>
            {/* 일정관리 내용 추가 예정 */}
          </div>
        </div>
        <div className={styles.Row}>
          <ContractAmount
            icon={<BsDatabase style={{ width: "100%", height: "100%" }} />}
            color="#7152F3"
            name="계약금액"
            amount="12,390,000,000 ₩"
            updatedDate="2024년 11월 20일"
          />
          <ContractAmount
            icon={<BsDatabase style={{ width: "100%", height: "100%" }} />}
            color="#7152F3"
            name="확입금액"
            amount="8,990,000,000 ₩"
            updatedDate="2024년 11월 20일"
          />
        </div>
        <div className={styles.Row}>
          <ClientList clients={clients} />
        </div>
        <div className={styles.Row}>
          <div className={styles.Notice}>
            <div className={styles.NoticeTitle}>공지사항</div>
            <div className={styles.NoticeContent}>[임시공지사항] 시스템 점검 예정</div>
            {/* 공지 내용 추가 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;