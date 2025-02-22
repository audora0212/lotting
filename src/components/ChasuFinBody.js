import { useState, useEffect } from "react";
import { BsBagDash, BsDatabase } from "react-icons/bs";
import { ModifyButton } from "@/components/Button";
import styles from "@/styles/Inputmoney.module.scss";
import Link from "next/link";
import { fetchCompletedPhases } from "@/utils/api";

const ChasuFinBody = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const fetchedData = await fetchCompletedPhases(userId);
      setData(fetchedData); // 원본 데이터 저장
      console.log("Fetched Data:", fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!data || data.length === 0) {
    return <div className={styles.ContentPreBody}>
      <div className={styles.ContentBodyTitle}>완납된 납부 내역이 없습니다.</div>
    </div>
      ;
  }

  return (
    <div>
      {data
        .filter(item => item.feesum !== 0) // ✅ 총액이 0인 항목 제외
        .map((item, index) => (
          <div key={index} className={styles.ContentFinBody}>
            <div className={styles.ContentBodyTitle}>
              <div className={styles.CBTIcon}>
                <div className={styles.Icon}>
                  <BsBagDash style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
              <div className={styles.CBTText}>
                <div className={styles.CBTCha}>
                  <div className={styles.CBTChaFont}>{item.phaseNumber}차 납부</div>
                </div>
                <div className={styles.CBTDate}>
                  <div className={styles.CBTDateFont}>
                    완납일자: {item.fullpaiddate ? item.fullpaiddate : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.CBBottonBody}>
              <ModifyButton>
                <Link href={`/inputmoney/payinfo/${userId}/${item.phaseNumber}`}>
                  <div className={styles.CBBottonFont}>납부수정</div>
                </Link>
              </ModifyButton>
            </div>
            <div className={styles.CBSum}>
              <div className={styles.CBMoneyImg}>
                <div className={styles.Icon2}>
                  <BsDatabase style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
              <div className={styles.CBSumText}>{item.phaseNumber}차 총액</div>
              <div className={styles.CBSumNum}>
                {item.feesum.toLocaleString()} ₩
              </div>
            </div>
            <div className={styles.CBSum}>
              <div className={styles.CBMoneyImg}>
                <div className={styles.Icon2}>
                  <BsDatabase style={{ width: "100%", height: "100%" }} />
                </div>
              </div>
              <div className={styles.CBSumText}>납입금액</div>
              <div className={styles.CBSumNum} style={{ color: "#3E9C12" }}>
                {item.charged ? item.charged.toLocaleString() : 0} ₩
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChasuFinBody;
