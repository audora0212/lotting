"use client";
import React from "react";
import styles from "./InstallmentAmounts.module.scss";

const InstallmentAmounts = ({ phaseSummaries, loading }) => {
  if (loading) {
    return <div>loading...</div>;
  }

  // 각 차수별 데이터 변환
  const data = phaseSummaries.map((item) => ({
    installment: `${item.phaseNumber}차`,
    paid: `${(item.totalDeposited || 0).toLocaleString()} ₩`,
    unpaid: `${(item.totalUnpaid || 0).toLocaleString()} ₩`,
  }));

  // 전체 합계 계산
  const totalPaid = phaseSummaries.reduce(
    (acc, cur) => acc + (cur.totalDeposited || 0),
    0
  );
  const totalUnpaid = phaseSummaries.reduce(
    (acc, cur) => acc + (cur.totalUnpaid || 0),
    0
  );

  return (
    <div className={styles.installmentContainer}>
      <div className={styles.header}>
        <div>차수</div>
        <div>납입 금액</div>
        <div>미납 금액</div>
      </div>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <div className={styles.row}>
            <div className={styles.installment}>{item.installment}</div>
            <div className={styles.paid}>{item.paid}</div>
            <div className={styles.unpaid}>{item.unpaid}</div>
          </div>
          {/* 각 항목 사이에 구분선 추가 */}
          {index !== data.length - 1 && (
            <hr className={styles.NoticeDivider} />
          )}
        </React.Fragment>
      ))}
      {/* 총합 표시 */}
      <hr className={styles.NoticeDivider} />
      <div className={styles.row}>
        <div className={styles.installment}>
          <strong>총합</strong>
        </div>
        <div className={styles.paid}>
          <strong>{totalPaid.toLocaleString()} ₩</strong>
        </div>
        <div className={styles.unpaid}>
          <strong>{totalUnpaid.toLocaleString()} ₩</strong>
        </div>
      </div>
    </div>
  );
};

export default InstallmentAmounts;
