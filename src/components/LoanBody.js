// ChasuPreBody 컴포넌트
import { useState, useEffect } from "react";
import { fetchLoanInit } from '@/utils/api';
import { BsBagDash } from "react-icons/bs";
import { BsDatabase } from "react-icons/bs";
import { SearchButton, ModifyButton } from "@/components/Button";
import styles from "@/styles/Inputmoney.module.scss";
import Link from "next/link";

const LoanBody = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const fetchedData = await fetchLoanInit();
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <div className={styles.ContentBody_L}>
                  <div className={styles.ContentBodyTitle_L}>
                  <div className={styles.CBTIcon}>
                      <div className={styles.Icon}>
                        <BsBagDash style={{ width: '100%', height: '100%' }} />
                      </div>
                    </div>
                    <div className={styles.CBTText}>
                      <div className={styles.CBTCha}>
                        <div className={styles.CBTChaFont}>대출 / 자납</div>
                      </div>
                      <div className={styles.CBTDate}>
                        <div className={styles.CBTDateFont}>대출일 : {loanData.loandate?new Date(loanData.loandate).toLocaleDateString('KR-GB'):"대출정보 없음."} </div>
                        <div className={styles.CBTDateFont}>자납일 : {loanData.loandate?new Date(loanData.selfdate).toLocaleDateString('KR-GB'):"대출정보 없음."}</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.CBBottonBody}>
                  <Link href = "/inputmoney/loan">
                    <ModifyButton>
                      <div className={styles.CBBottonFont}>대출수정</div>
                    </ModifyButton>
                  </Link>
                  </div>
                  <div className={styles.CBSum}>
                  <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: '100%', height: '100%' }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>대출액</div>
                    <div className={styles.CBSumNum}>{((loanData.price1 !== undefined ? loanData.price1 : 0) + (loanData.price2 !== undefined ? loanData.price2 : 0)).toLocaleString()} ₩</div>
                  </div>
                  <div className={styles.CBSum}>
                  <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: '100%', height: '100%' }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>자납액</div>
                    <div className={styles.CBSumNum}>{(loanData.selfprice !== undefined ? loanData.selfprice : 0).toLocaleString()} ₩</div>
                  </div>
                  <div className={styles.CBSum}>
                  <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: '100%', height: '100%' }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>총액</div>
                    <div className={styles.CBSumNum}>{((loanData.selfprice !== undefined ? loanData.selfprice : 0) + (loanData.price1 !== undefined ? loanData.price1 : 0) + (loanData.price2 !== undefined ? loanData.price2 : 0)).toLocaleString()} ₩</div>
                  </div>
                </div>
            
  );
};

export default LoanBody;
