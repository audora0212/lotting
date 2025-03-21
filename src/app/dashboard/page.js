// src/app/dashboard/page.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchContractedCustomers,
  fetchFullyPaidCustomers,
  getPhaseSummaries,
  fetchNotices,
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
  const [contractAmount, setContractAmount] = useState("loading...");
  const [confirmDepositAmount, setConfirmDepositAmount] = useState("loading...");
  const [phaseSummaries, setPhaseSummaries] = useState([]);
  const [phaseLoading, setPhaseLoading] = useState(true);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [contracted, fullyPaid, summary, noticeData] = await Promise.all([
          fetchContractedCustomers(),
          fetchFullyPaidCustomers(),
          getPhaseSummaries(),
          fetchNotices(),
        ]);

        setContractedCount(contracted);
        setFullyPaidCount(fullyPaid);
        setPhaseSummaries(summary);
        setPhaseLoading(false);

        const totalDeposited = summary.reduce(
          (acc, cur) => acc + (cur.totalDeposited || 0),
          0
        );
        const totalUnpaid = summary.reduce(
          (acc, cur) => acc + (cur.totalUnpaid || 0),
          0
        );
        setContractAmount(totalDeposited + totalUnpaid);
        setConfirmDepositAmount(totalDeposited);

        setNotices(noticeData);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const formatWon = (value) => {
    if (typeof value === "number") {
      return value.toLocaleString() + " ₩";
    }
    return value;
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

            <div className={styles.Row}>
              <ClientList clients={clients} />
            </div>

            {/* 공지사항 영역 - 세로로 쌓이고 각 항목 사이에 구분선 추가 */}
            <div className={styles.Row}>
              <div className={styles.Notice}>
                <div className={styles.NoticeTitle}>공지사항</div>
                <div className={styles.NoticeContent}>
                  {notices.length === 0 ? (
                    "[ loading... ]"
                  ) : (
                    notices.map((notice, index) => (
                      <React.Fragment key={notice.id}>
                        <Link
                          href={`/dashboard/notice/${notice.id}`}
                          className={styles.NoticeItem}
                        >
                          <div>
                            <strong>{notice.title}</strong>
                          </div>
                          <div className={styles.NoticeMeta}>
                            <span>
                              수정일:{" "}
                              {new Date(notice.updatedAt).toLocaleDateString()}
                            </span>
                            <span>
                              작성자: {notice.author || "관리자"}
                            </span>
                          </div>
                        </Link>
                        {index !== notices.length - 1 && (
                          <hr className={styles.NoticeDivider} />
                        )}
                      </React.Fragment>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 - 차수별 납입/미납 금액 */}
          <div className={styles.RightColumn}>
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
