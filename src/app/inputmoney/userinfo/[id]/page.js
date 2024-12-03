"use client";
//app/inputmoney/userinfo/[id]
import styles from "@/styles/Inputmoney.module.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useridState } from "@/utils/atom";
import { useRecoilValueLoadable, useRecoilState } from "recoil";
import { userinfoSelector } from "@/utils/selector";

import { BsBagDash, BsDatabase } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";

import ChasuPreBody from "@/components/ChasuPreBody";
import ChasuFinBody from "@/components/ChasuFinBody";
import { SearchButton, ModifyButton } from "@/components/Button";

import withAuth from "@/utils/hoc/withAuth"; // withAuth 임포트

function Inputmoney() {
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const [IdState, setIdState] = useRecoilState(useridState);

  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState(null);

  useEffect(() => {
    setIdState(splitpath[3]);
  }, [splitpath, setIdState]);

  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  useEffect(() => {
    if (userselectordata.state === "hasValue") {
      const userdata = userselectordata.contents;
      if (userdata === undefined) {
        console.log("잘못된 접근입니다");
      } else {
        setUserData(userdata);
        setLoanData(userdata.loan); // loan 데이터 설정
      }
    }
  }, [userselectordata]);

  const formatDate = (date) => {
    return date ? date : "없음";
  };

  return (
    <>
      {userselectordata.state === "hasValue" && userData && (
        <div className={styles.Container}>
          <div className={styles.Mainbody}>
            <div className={styles.SearchBody}>
              {/* 사용자 정보 표시 부분 */}
              <div className={styles.SearchNum}>
                <div className={styles.SearchFont1}>관리번호 :</div>
                <div className={styles.SearchFont2}>{userData.id}</div>
              </div>
              <div className={styles.SearchName}>
                <div className={styles.SearchFont1}>성함 :</div>
                <div className={styles.SearchFont2}>
                  {userData.customerData?.name}
                </div>
              </div>
              <div className={styles.SearchCha}>
                <div className={styles.SearchFont1}>가입차순 :</div>
                <div className={styles.SearchFont2}>{userData.batch}</div>
              </div>
              <div className={styles.SearchType}>
                <div className={styles.SearchFont1}>가입타입 :</div>
                <div className={styles.SearchFont2}>{userData.type}</div>
              </div>
              {/* 납부 정보 표시 부분 */}
            </div>
            <div className={styles.MainContent}>
              <div
                className={styles.Content}
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
              >
                <div className={styles.ContentTitle}>
                  <div className={styles.ContentTitleIcon_Y}></div>
                  <div className={styles.ContentTitleFont}>진행 예정 납부</div>
                </div>
                <ChasuPreBody userId={userData.id} />
              </div>

              <div
                className={styles.Content}
                style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
              >
                <div className={styles.ContentTitle}>
                  <div className={styles.ContentTitleIcon_G}></div>
                  <div className={styles.ContentTitleFont}>진행된 납부</div>
                </div>
                <ChasuFinBody userId={userData.id} />
              </div>
              <div className={styles.Content}>
                <div className={styles.ContentTitle}>
                  <div className={styles.ContentTitleIcon_R}></div>
                  <div className={styles.ContentTitleFont}>
                    대출 / 자납 / 해약
                  </div>
                </div>
                <div className={styles.ContentBody_L}>
                  <div className={styles.ContentBodyTitle_L}>
                    <div className={styles.CBTIcon}>
                      <div className={styles.Icon}>
                        <BsBagDash style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBTText}>
                      <div className={styles.CBTCha}>
                        <div className={styles.CBTChaFont}>대출 / 자납</div>
                      </div>
                      <div className={styles.CBTDate}>
                        <div className={styles.CBTDateFont}>
                          대출일 :{" "}
                          {loanData?.loandate
                            ? loanData.loandate.slice(0, 10)
                            : "없음"}
                        </div>
                        <div className={styles.CBTDateFont}>
                          자납일 :{" "}
                          {loanData?.selfdate
                            ? loanData.selfdate.slice(0, 10)
                            : "없음"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.CBBottonBody}>
                    <Link href={`/inputmoney/loan/${userData.id}`}>
                      <ModifyButton>
                        <div className={styles.CBBottonFont}>대출수정</div>
                      </ModifyButton>
                    </Link>
                  </div>
                  <div className={styles.CBSum}>
                    <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>대출액</div>
                    <div className={styles.CBSumNum}>
                      {(
                        (loanData?.loanprice1 || 0) +
                        (loanData?.loanprice2 || 0)
                      ).toLocaleString()}{" "}
                      ₩
                    </div>
                  </div>
                  <div className={styles.CBSum}>
                    <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>자납액</div>
                    <div className={styles.CBSumNum}>
                      {(loanData?.selfpayprice || 0).toLocaleString()} ₩
                    </div>
                  </div>
                  <div className={styles.CBSum}>
                    <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>총액</div>
                    <div className={styles.CBSumNum}>
                      {(
                        (loanData?.selfpayprice || 0) +
                        (loanData?.loanprice1 || 0) +
                        (loanData?.loanprice2 || 0)
                      ).toLocaleString()}{" "}
                      ₩
                    </div>
                  </div>
                </div>
                {/* 한 덩어리 */}

                <div className={styles.ContentBody}>
                  <div className={styles.ContentBodyTitle}>
                    <div className={styles.CBTIcon}>
                      <div className={styles.Icon}>
                        <BsBagDash style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBTText}>
                      <div className={styles.CBTCha}>
                        <div className={styles.CBTChaFont}>해약</div>
                      </div>
                      <div className={styles.CBTDate}>
                        <div className={styles.CBTDateFont}>해약시 주의</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.CBBottonBody}>
                    <Link href="/inputmoney/cancel">
                      <ModifyButton>
                        <div className={styles.CBBottonFont}>해약하기</div>
                      </ModifyButton>
                    </Link>
                  </div>
                </div>
                {/* 한 덩어리 */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default withAuth(Inputmoney); // withAuth로 감싸기
