"use client";
import React from "react";
import styles from "./InstallmentAmounts.module.scss";

const InstallmentAmounts = ({ phaseSummaries, loading }) => {
  // 로딩 중이면 로딩 문구
  if (loading) {
    return <div>loading...</div>;
  }

  // 데이터를 받아서 UI에 맞춰 표시
  // 부모에서 이미 phaseSummaries는 [{phaseNumber, totalDeposited, totalUnpaid}, ...] 형태
  // 적절히 toLocaleString 처리 등 진행
  const data = phaseSummaries.map((item) => ({
    installment: `${item.phaseNumber}차`,
    paid: `${(item.totalDeposited || 0).toLocaleString()} ₩`,
    unpaid: `${(item.totalUnpaid || 0).toLocaleString()} ₩`,
  }));

  return (
    <div className={styles.installmentContainer}>
      <div className={styles.header}>
        <div>차수</div>
        <div>납입 금액</div>
        <div>미납 금액</div>
      </div>
      {data.map((item, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.installment}>{item.installment}</div>
          <div className={styles.paid}>{item.paid}</div>
          <div className={styles.unpaid}>{item.unpaid}</div>
        </div>
      ))}
    </div>
  );
};

export default InstallmentAmounts;
