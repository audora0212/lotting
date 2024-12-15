// ContractSummary.js
import React, { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import { fetchContractedCustomers, fetchFullyPaidCustomers } from "@/utils/api";
import styles from '../../styles/Dashboard.module.scss'

const ContractSummary = ({ icon, color, name, value, percentage, updatedDate }) => {
  return (
    <div className={styles.ContractSum}>
      <div className={styles.ContractValue}>
        <div className={styles.ContractIcons}>
          <div className={styles.ContractImg} style={{ color }}>
            {icon}
          </div>
        </div>
        <div className={styles.ContractName}>{name}</div>
      </div>
      <div className={styles.ContractValue2}>
        <div className={styles.ContractVal1}>
          <div className={styles.Value}>{value}</div>
        </div>
        {percentage && (
          <div className={styles.ContractVal2}>
            <div className={styles.Percentage_G}>
              <div className={styles.UpImg} style={{ color: "#30BE82" }}>
                <AiFillCaretUp style={{ width: "100%", height: "100%" }} />
              </div>
              <div className={styles.UpText}>{percentage}%</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.Bottominfo}>
        <div className={styles.BottomDate}>업데이트 : {updatedDate}</div>
      </div>
    </div>
  );
};

export default ContractSummary;