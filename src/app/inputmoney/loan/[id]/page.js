"use client";

import { Inputbox, Inputbox_L } from "@/components/Inputbox";
import { Button_Y, Button_N } from "@/components/Button";
import styles from "@/styles/Inputmoneyloan.module.scss";
import { BsDatabase } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useridState } from "@/utils/atom";
import { useRecoilValueLoadable, useRecoilState } from "recoil";
import { userinfoSelector } from "@/utils/selector";
import { usePathname, useRouter } from "next/navigation";
import { fetchLoanInit, fetchLoanUpdate } from "@/utils/api";
import withAuth from "@/utils/hoc/withAuth";
import Link from "next/link";

function Inputmoneyloan() {
  const router = useRouter();
  const [loandate, setLoandate] = useState("");
  const [loanbank, setLoanbank] = useState("");
  const [loanammount, setLoanammount] = useState("");
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const [selfdate, setSelfdate] = useState("");
  const [selfammount, setSelfammount] = useState("");

  const [tot, setTot] = useState(0);
  const [userData, setUserData] = useState(null);
  const [IdState, setIdState] = useRecoilState(useridState);
  const userselectordata = useRecoilValueLoadable(userinfoSelector);
  const pathname = usePathname();

  useEffect(() => {
    const regex = /\/(\d+)$/;
    const match = pathname.match(regex);
    if (match) {
      const extractedId = parseInt(match[1], 10);
      setIdState(extractedId);
    }
  }, [pathname, setIdState]);

  useEffect(() => {
    fetchData();
  }, [IdState]);

  const fetchData = async () => {
    try {
      const fetchedData = await fetchLoanInit(IdState);
      if (fetchedData) {
        setLoandate(
          fetchedData.loandate ? fetchedData.loandate.substring(0, 10) : ""
        );
        setLoanbank(fetchedData.loanbank || "");
        setLoanammount(
          fetchedData.loanammount ? fetchedData.loanammount.toString() : ""
        );
        setSelfdate(
          fetchedData.selfdate ? fetchedData.selfdate.substring(0, 10) : ""
        );
        setSelfammount(
          fetchedData.selfammount ? fetchedData.selfammount.toString() : ""
        );
        setTot(fetchedData.loanselfsum || 0);
      } else {
        // Loan 데이터가 없는 경우 기본값
        setLoandate("");
        setLoanbank("");
        setLoanammount("");
        setSelfdate("");
        setSelfammount("");
        setTot(0);
      }
    } catch (error) {
      console.error("Error fetching loan data:", error);
      setLoandate("");
      setLoanbank("");
      setLoanammount("");
      setSelfdate("");
      setSelfammount("");
      setTot(0);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [loanammount, selfammount]);

  const calculateTotal = () => {
    const loanValue = parseInt(loanammount, 10) || 0;
    const selfValue = parseInt(selfammount, 10) || 0;
    const total = loanValue + selfValue;
    setTot(total);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "loandate":
        setLoandate(value);
        break;
      case "loanbank":
        setLoanbank(value);
        break;
      case "loanammount":
        setLoanammount(value);
        break;
      case "selfdate":
        setSelfdate(value);
        break;
      case "selfammount":
        setSelfammount(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const loanValue = parseInt(loanammount, 10) || 0;
      const selfValue = parseInt(selfammount, 10) || 0;
      const sumValue = loanValue + selfValue;
  
      const updatedData = {
        loandate: loandate || null,
        loanbank: loanbank || null,
        loanammount: loanValue || 0,
        selfdate: selfdate || null,
        selfammount: selfValue || 0,
        loanselfsum: sumValue || 0,
        loanselfcurrent: sumValue || 0,
      };
  
      console.log("📌 저장 요청 데이터:", updatedData);
  
      // 🔹 백엔드 요청 실행 (에러 나도 이동)
      try {
        await fetchLoanUpdate(IdState, updatedData);
        console.log("✅ 대출/자납액 업데이트 완료!");
      } catch (error) {
        console.error("❌ 백엔드 오류 발생, 하지만 이동 진행:", error);
      }
  
      // 🔹 백엔드 응답과 관계없이 페이지 이동
      router.push(`/inputmoney/loan/apply/${IdState}`);
  
    } catch (error) {
      console.error("❌ 오류 발생:", error);
    }
  };
  
    
  
  
  
  return (
    <>
      {userselectordata.state === "hasValue" &&
        (userData || userselectordata.contents) && (
          <div className={styles.Container}>
            <form onSubmit={onSubmit}>
              <div className={styles.Mainbody}>
                <div className={styles.MainTitle}>
                  <div className={styles.MainTitle1}>
                    <div className={styles.SearchClientNum}>
                      <div className={styles.SearchFont1}>고객번호 : </div>
                      <div className={styles.SearchFont2}>{IdState}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.InputBody}>
                  {/* 대출 섹션 */}
                  <div className={styles.InputBodyTitle}>
                    <div className={styles.IBTIcon}>
                      <div className={styles.Icon} style={{ color: "#7152F3" }}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.IBTText}>대출</div>
                  </div>
                  <div className={styles.Line}></div>
                  <div className={styles.IBLayer}>
                    <Inputbox
                      type="date"
                      date_placeholder="대출일"
                      name="loandate"
                      onChange={onChange}
                      value={loandate}
                    />
                  </div>
                  <div className={styles.IBLayer}>
                    <Inputbox_L
                      type="text"
                      placeholder="대출은행"
                      name="loanbank"
                      onChange={onChange}
                      value={loanbank}
                    />
                  </div>
                  <div className={styles.IBLayer}>
                    <Inputbox_L
                      type="text"
                      placeholder="대출액"
                      name="loanammount"
                      onChange={onChange}
                      value={loanammount}
                    />
                  </div>

                  {/* 자납 섹션 */}
                  <div className={styles.InputBodyTitle}>
                    <div className={styles.IBTIcon}>
                      <div className={styles.Icon} style={{ color: "#7152F3" }}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.IBTText}>자납</div>
                  </div>

                  <div className={styles.IBLayer}>
                    <Inputbox
                      type="date"
                      date_placeholder="자납일"
                      name="selfdate"
                      onChange={onChange}
                      value={selfdate}
                    />
                  </div>

                  <div className={styles.IBLayer}>
                    <Inputbox_L
                      type="text"
                      placeholder="자납액"
                      name="selfammount"
                      onChange={onChange}
                      value={selfammount}
                    />
                  </div>

                  {/* 총액 섹션 */}
                  <div className={styles.InputBodyTitle}>
                    <div className={styles.IBTIcon}>
                      <div className={styles.Icon} style={{ color: "#7152F3" }}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.IBTText}>합계</div>
                  </div>

                  <div className={styles.IBLayer}>
                    <div className={styles.SearchFont1}>합계 :</div>
                    <div className={styles.SearchFont2}>
                      {tot.toLocaleString()}₩
                    </div>
                  </div>

                  {/* 버튼 섹션 */}
                  <div className={styles.IBBottonLayer}>
                    <Button_N type="button" onClick={() => router.back()}>
                      <div className={styles.BottonFont2}>취소</div>
                    </Button_N>
                    <Button_Y type="submit" disabled={loading}>
  <div className={styles.BottonFont}>
    {loading ? "처리 중..." : "확인"}
  </div>
</Button_Y>


                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
    </>
  );
}

export default withAuth(Inputmoneyloan);
