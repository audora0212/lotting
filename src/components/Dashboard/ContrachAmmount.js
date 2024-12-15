// ContractAmount.js
import React from "react";

import styles from '../../styles/Dashboard.module.scss'

const ContractAmount = ({ icon, color, name, amount, updatedDate }) => {
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
        <div className={styles.ContractVal}>
          <div className={styles.Value}>{amount}</div>
        </div>
      </div>
      <div className={styles.Bottominfo}>
        <div className={styles.BottomDate}>업데이트 : {updatedDate}</div>
      </div>
    </div>
  );
};

export default ContractAmount;
