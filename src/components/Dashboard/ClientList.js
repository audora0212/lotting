// ClientList.js
import React from "react";
import styles from '../../styles/Dashboard.module.scss'

const ClientList = ({ clients }) => {
  return (
    <div className={styles.ClientBody}>
      <div className={styles.ClientContents}>
        <div className={styles.ClientTitle}>
          <div className={styles.ClientTitle1}>
            <div className={styles.Titlefont}>미납자 명단</div>
          </div>
        </div>
        <div className={styles.ClientCategory}>
          <div className={styles.Number}>
            <div className={styles.Categoryfont}>관리번호</div>
          </div>
          <div className={styles.Name}>
            <div className={styles.Categoryfont}>성명</div>
          </div>
          <div className={styles.Cha}>
            <div className={styles.Categoryfont}>최종납부</div>
          </div>
          <div className={styles.Dong}>
            <div className={styles.Categoryfont}>임시동호</div>
          </div>
        </div>
        {clients.map((client, index) => (
          <div key={index} className={styles.ClientValue}>
            <div className={styles.Number}>
              <div className={styles.Valuefont}>{client.id}</div>
            </div>
            <div className={styles.Name}>
              <div className={styles.Valuefont}>{client.name}</div>
            </div>
            <div className={styles.Cha}>
              <div className={styles.Valuefont}>{client.lastPayment}</div>
            </div>
            <div className={styles.Dong}>
              <div className={styles.Valuefont}>{client.tempDong}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;