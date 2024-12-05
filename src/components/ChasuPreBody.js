import { useState, useEffect } from "react";
import { BsBagDash, BsDatabase } from "react-icons/bs";
import { ModifyButton } from "@/components/Button";
import styles from "@/styles/Inputmoney.module.scss";
import Link from "next/link";
import { fetchPendingPhases } from "@/utils/api";

const ChasuPreBody = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const fetchedData = await fetchPendingPhases(userId);
      setData(fetchedData);
      console.log(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Helper function to determine the display value for planned date
  const getDisplayPlannedDate = (phase) => {
    const { planneddate, planneddateString } = phase;

    if (!planneddate) {
      return ""; // Return empty string if planneddate is undefined or null
    }

    const date = new Date(planneddate);
    const cutoff = new Date("2100-01-01");

    if (isNaN(date.getTime())) {
      // If planneddate is not a valid date
      return planneddateString || "";
    }

    if (date > cutoff) {
      return planneddateString || "";
    }

    // Format the date as desired, e.g., YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  if (!data || data.length === 0) {
    return <p>예정된 납부 내역이 없습니다.</p>;
  }

  return (
    <div>
      {data.map((item, index) => (
        <div key={index} className={styles.ContentPreBody}>
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
                  예정일자: {getDisplayPlannedDate(item) || "N/A"}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.CBBottonBody}>
            <ModifyButton onClick={() => {}}>
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
              {item.feesum ? item.feesum.toLocaleString() : 0} ₩
            </div>
          </div>
          <div className={styles.CBSum}>
            <div className={styles.CBMoneyImg}>
              <div className={styles.Icon2}>
                <BsDatabase style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
            <div className={styles.CBSumText}>납입금액</div>
            <div className={styles.CBSumNum}>
              {item.charged ? item.charged.toLocaleString() : 0} ₩
            </div>
          </div>
          <div className={styles.CBSum}>
            <div className={styles.CBMoneyImg}>
              <div className={styles.Icon2}>
                <BsDatabase style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
            <div className={styles.CBSumText}>미납금액</div>
            <div className={styles.CBSumNum} style={{ color: "#D11414" }}>
              {item.sum ? item.sum.toLocaleString() : 0} ₩
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChasuPreBody;
