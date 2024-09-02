// ChasuPreBody 컴포넌트
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { searchPrechasu } from "@/utils/api";
import { BsBagDash } from "react-icons/bs";
import { BsDatabase } from "react-icons/bs";
import { SearchButton, ModifyButton } from "@/components/Button";
import styles from "@/styles/Inputmoney.module.scss";
import Link from "next/link";

const ChasuPreBody = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedData = await searchPrechasu(userId);
      setData(fetchedData);
      console.log(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!data) {
    return null;
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
                <div className={styles.CBTChaFont}>{item.chasu}차 납부</div>
              </div>
              <div className={styles.CBTDate}>
                <div className={styles.CBTDateFont}>
                  업데이트 : {item.duedate}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.CBBottonBody}>
            <ModifyButton onClick={() => {}}>
              <Link href={`/inputmoney/payinfo/${userId}/${item.chasu}`}>
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
            <div className={styles.CBSumText}>{item.chasu}차 총액</div>
            <div className={styles.CBSumNum}>
              {item.sumprice.toLocaleString()} ₩
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
              {item.payprice.toLocaleString()} ₩
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
              {(item.sumprice - item.payprice).toLocaleString()} ₩
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChasuPreBody;
