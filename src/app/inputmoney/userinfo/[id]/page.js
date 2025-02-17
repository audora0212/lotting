"use client";
// src/app/inputmoney/userinfo/[id]/page.js

import styles from "@/styles/Inputmoney.module.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useridState } from "@/utils/atom";
import {
  useRecoilValueLoadable,
  useRecoilState,
  useRecoilRefresher_UNSTABLE,
} from "recoil";
import { userinfoSelector } from "@/utils/selector";

import { BsBagDash, BsDatabase } from "react-icons/bs";
import { FaEdit, FaFileInvoice } from "react-icons/fa";
import ChasuPreBody from "@/components/ChasuPreBody";
import ChasuFinBody from "@/components/ChasuFinBody";
import { SearchButton, ModifyButton } from "@/components/Button";

import withAuth from "@/utils/hoc/withAuth";
import { cancelCustomer } from "@/utils/api";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function Inputmoney() {
  const refreshUserInfo = useRecoilRefresher_UNSTABLE(userinfoSelector); // Recoil 데이터 강제 새로고침 훅
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const [IdState, setIdState] = useRecoilState(useridState);

  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [loanex, setLoanex] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (splitpath.length > 3) {
      setIdState(splitpath[3]);
    }
  }, [splitpath, setIdState]);

  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  useEffect(() => {
    // 컴포넌트가 마운트될 때마다 userinfoSelector를 강제로 새로고침
    refreshUserInfo();
  }, [IdState, refreshUserInfo]);

  useEffect(() => {
    if (userselectordata.state === "hasValue") {
      const userdata = userselectordata.contents;
      if (userdata === undefined) {
        console.log("잘못된 접근입니다");
      } else {
        setUserData(userdata);
        setLoanData(userdata.loan);
        setLoanex(userdata.status.loanExceedAmount);
      }
    }
  }, [userselectordata]);

  // 상태 업데이트 후 loanex 값 확인 (디버깅용)
  useEffect(() => {
    console.log("Updated loanex:", loanex);
  }, [loanex]);

  const handleCancel = () => {
    MySwal.fire({
      title: "해약하시겠습니까?",
      text: "해약을 진행하면 가입 타입이 'x'로 변경됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelCustomer(IdState)
          .then(() => {
            MySwal.fire(
              "해약 완료!",
              "고객의 가입 타입이 'x'로 변경되었습니다.",
              "success"
            );
            setTimeout(() => {
              // 해약 후 데이터 새로고침
              refreshUserInfo();
              router.push(`/inputmoney/userinfo/${IdState}`);
            }, 2000);
          })
          .catch((error) => {
            MySwal.fire(
              "해약 실패!",
              "해약 처리 중 오류가 발생했습니다.",
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      {userselectordata.state === "hasValue" && userData && (
        <div className={styles.Container}>
          <div className={styles.Mainbody}>
            <div className={styles.SearchBody}>
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
            </div>
            <div className={styles.buttonContainer}>
              <Link href={`/inputmoney/deposit/${userData.id}`}>
                <button className={styles.contractButton}>
                  <FaFileInvoice className={styles.editIcon} />
                  입금내역 확인/추가
                </button>
              </Link>

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
                  </div>
                  <div className={styles.CBSum}>
                    <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>대출액</div>
                    <div className={styles.CBSumNum}>
                      {(loanData?.loanammount || 0).toLocaleString()} ₩
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
                      {(loanData?.selfammount || 0).toLocaleString()} ₩
                    </div>
                  </div>
                  <div className={styles.CBSum}>
                    <div className={styles.CBMoneyImg}>
                      <div className={styles.Icon2}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.CBSumText}>잔액</div>
                    <div className={styles.CBSumNum}>
                      {(loanex || 0).toLocaleString()} ₩
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
                        (loanData?.selfammount || 0) +
                        (loanData?.loanammount || 0)
                      ).toLocaleString()} ₩
                    </div>
                  </div>
                </div>
                {/* 해약 섹션 */}
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
                        <div className={styles.CBTDateFont}>해약 시 주의</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.CBBottonBody}>
                    <ModifyButton onClick={handleCancel}>
                      <div className={styles.CBBottonFont}>해약하기</div>
                    </ModifyButton>
                  </div>
                </div>
                {/* 해약 섹션 끝 */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default withAuth(Inputmoney);
