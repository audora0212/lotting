// src/app/search/[id]/page.js
"use client";

import styles from "@/styles/Userinfo.module.scss";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  useRecoilValueLoadable,
  useSetRecoilState,
  useRecoilRefresher_UNSTABLE,
} from "recoil";
import { userinfoSelector } from "@/utils/selector";
import { useEffect } from "react";
import { useridState } from "@/utils/atom";
import { DownloadButton, Button } from "@/components/Button";
import withAuth from "@/utils/hoc/withAuth";
import { FaEdit,FaFileInvoice  } from "react-icons/fa";
import categoryMapping from "@/utils/categoryMapping";
import Link from "next/link";
import { downloadFormat1, downloadFormat2 } from "@/utils/api";

function Search() {
  const params = useParams();
  const userid = params.id;
  const setIdState = useSetRecoilState(useridState);
  const refreshUserInfo = useRecoilRefresher_UNSTABLE(userinfoSelector);
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const sortMapping = categoryMapping;
  const router = useRouter();

    const handleDownloadFormat1 = () => {
      console.log(1)
      if (!userid) return;
      downloadFormat1(userid);
    };
  
    const handleDownloadFormat2 = () => {
      if (!userid) return;
      downloadFormat2(userid);
    };

  useEffect(() => {
    if (userid) {
      setIdState(userid);
      refreshUserInfo();
    } else {
      console.error("유효하지 않은 사용자 ID입니다.");
    }
  }, [userid, setIdState, refreshUserInfo]);

  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  const getFileName = (filePath) => {
    if (!filePath) return "";
    return filePath.split(/[/\\]/).pop();
  };

  const formatNumberWithComma = (num) => {
    if (num == null) return "정보 없음";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (!userid) return null;

  switch (userselectordata.state) {
    case "hasValue":
      const userdata = userselectordata.contents;
      if (!userdata) {
        return <h1>잘못된 접근입니다</h1>;
      } else {
        return (
          <>
            {/* 1. 회원정보 */}
            <h3></h3>

            <div className={styles.buttonContainer}>
              {/* 계약서 다운로드 버튼 */}
              <button className={styles.contractButton} onClick={handleDownloadFormat1}>
                <FaFileInvoice className={styles.editIcon} />
                일반 신청서
              </button>
              {/* 계약서 다운로드 버튼 */}
              <button className={styles.contractButton} onClick={handleDownloadFormat2}>
                <FaFileInvoice className={styles.editIcon} />
                일반 부속 서류
              </button>
              {/* 수정 버튼 */}
              <Link href={`/modify/${userid}`} passHref>
                <button className={styles.editButton}>
                  <FaEdit className={styles.editIcon} />
                  수정
                </button>
              </Link>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>관리번호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.id || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>성명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.customerData?.name || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>주민번호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.customerData?.resnumfront || "정보 없음"}-
                    {userdata.customerData?.resnumback || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>이메일</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.customerData?.email || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>휴대전화</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.customerData?.phone || "정보 없음"}</span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>타입</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.type || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>군</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.groupname || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>순번</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.turn || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>가입차순</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.batch || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>분류</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {sortMapping[userdata.customertype] || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>가입일자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.registerdate
                      ? userdata.registerdate.slice(0, 10)
                      : "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>가입가</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.registerprice
                      ? formatNumberWithComma(userdata.registerprice)
                      : "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>예약금 납입일자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.deposits?.depositdate
                      ? userdata.deposits.depositdate.slice(0, 10)
                      : "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>예약금</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.deposits?.depositammount
                      ? formatNumberWithComma(userdata.deposits.depositammount)
                      : "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.postunitbody}>
                <div className={styles.posttitlebody}>
                  <span className={styles.title}>법정주소</span>
                </div>
                <div className={styles.postcontentbody}>
                  <span>
                    우편번호: {userdata.legalAddress?.postnumber || "정보 없음"}
                  </span>
                  <br />
                  <span>{userdata.legalAddress?.post || "정보 없음"}, </span>
                  <span>
                    {userdata.legalAddress?.detailaddress || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.postunitbody}>
                <div className={styles.posttitlebody}>
                  <span className={styles.title}>우편물 수령주소</span>
                </div>
                <div className={styles.postcontentbody}>
                  <span>
                    우편번호:{" "}
                    {userdata.postreceive?.postnumberreceive || "정보 없음"}
                  </span>
                  <br />
                  <span>
                    {userdata.postreceive?.postreceive || "정보 없음"},{" "}
                  </span>
                  <span>
                    {userdata.postreceive?.detailaddressreceive || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>은행명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.financial?.bankname || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>계좌번호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.financial?.accountnum || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>예금주</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.financial?.accountholder || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>7차 면제</span>
                </div>
                <div className={styles.contentbody}>
                  {userdata.attachments?.exemption7 ? (
                    <span>✔️</span>
                  ) : (
                    <span>❌</span>
                  )}
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>출자금</span>
                </div>
                <div className={styles.contentbody}>
                  {userdata.attachments?.investmentfile ? (
                    <span>✔️</span>
                  ) : (
                    <span>❌</span>
                  )}
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>지산A동 계약서</span>
                </div>
                <div className={styles.contentbody}>
                  {userdata.attachments?.contract ? (
                    <span>✔️</span>
                  ) : (
                    <span>❌</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>총괄</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.responsible?.generalmanagement || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>본부</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.responsible?.division || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>팀</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.responsible?.team || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>담당자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.responsible?.managername || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            {/* 2. 납입금관리 */}
            <h3>납입금 관리</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.linkbutton}>
                <Link href={`/inputmoney/userinfo/${splitpath[2]}`}>
                  <Button>
                    <h3>바로가기</h3>
                  </Button>
                </Link>
              </div>
            </div>
            <hr />

            {/* 3. 납입차수정보 */}
            <h3>납입차수 정보</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <table className={styles.phase_table}>
                  <thead>
                    <tr>
                      <th className={styles.narrowColumn2}>차수</th>
                      <th>예정일자</th>
                      <th>완납일자</th>
                      <th>부담금</th>
                      <th>할인액</th>
                      <th>면제액</th>
                      <th>업무 대행비</th>
                      <th>실납부액</th>
                      <th className={styles.narrowColumn}>이동</th>
                      <th>차수별 합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ...userdata.phases,
                      ...Array.from(
                        { length: 10 - (userdata.phases?.length || 0) },
                        (_, i) => ({
                          phaseNumber: (userdata.phases?.length || 0) + i + 1,
                        })
                      ),
                    ].map((phase, index) => {
                      // 연체 판단 로직
                      const isOverdue =
                        phase.planneddate &&
                        new Date(phase.planneddate) < new Date() &&
                        !phase.fullpaiddate;

                      const overdueAmount = phase.feesum || 0;

                      const handleRowClick = () => {
                        if (isOverdue) {
                          const url = `/search/overdue/${phase.phaseNumber}?amount=${overdueAmount}&userid=${userdata.id}&name=${encodeURIComponent(
                            userdata.customerData?.name || ""
                          )}`;
                          router.push(url);
                        }
                      };

                      return (
                        <tr
                          key={index}
                          className={isOverdue ? styles.overduePhase : ""}
                          style={{ cursor: isOverdue ? "pointer" : "default" }}
                          onClick={handleRowClick}
                        >
                          <td>{phase.phaseNumber || "없음"}</td>
                          <td>
                            {phase.planneddate
                              ? parseInt(phase.planneddate.slice(0, 4), 10) > 2100
                                ? "예정"
                                : phase.planneddate.slice(0, 10)
                              : "없음"}
                          </td>
                          <td>
                            {phase.fullpaiddate
                              ? phase.fullpaiddate.slice(0, 10)
                              : "없음"}
                          </td>
                          <td>
                            {phase.charge
                              ? formatNumberWithComma(phase.charge)
                              : "없음"}
                          </td>
                          <td>
                            {phase.discount
                              ? formatNumberWithComma(phase.discount)
                              : "없음"}
                          </td>
                          <td>
                            {phase.exemption
                              ? formatNumberWithComma(phase.exemption)
                              : "없음"}
                          </td>
                          <td>
                            {phase.service
                              ? formatNumberWithComma(phase.service)
                              : "없음"}
                          </td>
                          <td>
                            {phase.charged
                              ? formatNumberWithComma(phase.charged)
                              : "없음"}
                          </td>
                          <td className={styles.narrowColumn}>
                            {phase.move || "없음"}
                          </td>
                          <td>
                            {phase.phaseNumber
                              ? formatNumberWithComma(
                                  userdata.phases
                                    ?.filter(
                                      (p) => p.phaseNumber === phase.phaseNumber
                                    )
                                    .reduce((sum, p) => sum + (p.feesum || 0), 0)
                                )
                              : "없음"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className={styles.phase_sum}>
                  <span>
                    총합계:{" "}
                    {formatNumberWithComma(
                      userdata.phases
                        ? userdata.phases.reduce(
                            (sum, phase) => sum + (phase.feesum || 0),
                            0
                          )
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            {/* 4. 대출및자납정보 */}
            <h3>대출 및 자납 정보</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <table className={styles.loan_table}>
                  <thead>
                    <tr>
                      <th>대출일자</th>
                      <th>은행</th>
                      <th>대출액</th>
                      <th>자납일자</th>
                      <th>자납액</th>
                      <th>합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userdata.loan ? (
                      <tr>
                        <td>
                          {userdata.loan.loandate
                            ? userdata.loan.loandate.slice(0, 10)
                            : "N/A"}
                        </td>
                        <td>{userdata.loan.loanbank || "정보 없음"}</td>
                        <td>
                          {userdata.loan.loanammount
                            ? formatNumberWithComma(userdata.loan.loanammount)
                            : "N/A"}
                        </td>
                        <td>
                          {userdata.loan.selfdate
                            ? userdata.loan.selfdate.slice(0, 10)
                            : "N/A"}
                        </td>
                        <td>
                          {userdata.loan.selfammount
                            ? formatNumberWithComma(userdata.loan.selfammount)
                            : "N/A"}
                        </td>
                        <td>
                          {userdata.loan.loanselfsum
                            ? formatNumberWithComma(userdata.loan.loanselfsum)
                            : "N/A"}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="6">대출 및 자납 정보가 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <hr />

            {/* 5,6. 총 면제금액 & 납입총액 */}
            <h3>총 면제금액 및 납입 총액</h3>
            <div className={styles.rowcontainer}>
              {/* 총 면제금액 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>총 면제금액</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.phases
                      ? formatNumberWithComma(
                          userdata.phases.reduce(
                            (sum, phase) => sum + (phase.exemption || 0),
                            0
                          )
                        )
                      : "0"}
                  </span>
                </div>
              </div>

              {/* 납입 총액 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>납입 총액</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.phases
                      ? formatNumberWithComma(
                          userdata.phases.reduce(
                            (sum, phase) => sum + (phase.charged || 0),
                            0
                          )
                        )
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            {/* 7. 부속서류 */}
            <h3>부속서류</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>부속 서류</span>
                </div>
                <div className={styles.contentbody}>
                  {userdata.attachments?.isuploaded &&
                  userdata.attachments?.fileinfo ? (
                    <DownloadButton
                      userid={userdata.id}
                      filename={getFileName(userdata.attachments.fileinfo)}
                    >
                      다운로드
                    </DownloadButton>
                  ) : (
                    <span>파일이 없습니다.</span>
                  )}
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>부속 서류 상태</span>
                </div>
                <div className={styles.contentbody}>
                  <div className={styles.attachmentsGrid}>
                    <div>
                      <span>인감증명서</span>
                      {userdata.attachments?.sealcertificateprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>본인서명확인서</span>
                      {userdata.attachments
                        ?.selfsignatureconfirmationprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>신분증</span>
                      {userdata.attachments?.idcopyprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>확약서</span>
                      {userdata.attachments?.commitmentletterprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>창준위용</span>
                      {userdata.attachments?.forfounding ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>무상옵션</span>
                      {userdata.attachments?.freeoption ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>선호도조사</span>
                      {userdata.attachments?.preferenceattachment ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>총회동의서</span>
                      {userdata.attachments?.agreement ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                    <div>
                      <span>사은품</span>
                      {userdata.attachments?.prizeattachment ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 사은품명 / 지급일자 표시 */}
            {userdata.attachments?.prizeattachment && (
              <div className={styles.rowcontainer}>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <span className={styles.title}>사은품명</span>
                  </div>
                  <div className={styles.contentbody}>
                    <span>{userdata.attachments?.prizename || "정보 없음"}</span>
                  </div>
                </div>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <span className={styles.title}>사은품 지급일자</span>
                  </div>
                  <div className={styles.contentbody}>
                    <span>
                      {userdata.attachments?.prizedate
                        ? userdata.attachments.prizedate.slice(0, 10)
                        : "정보 없음"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <hr />

            {/* 8. MGM */}
            <h3>MGM</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>업체명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgmcompanyname || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>이름</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgmname || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>은행명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgminstitution || "정보 없음"}</span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>계좌</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgmaccount || "정보 없음"}</span>
                </div>
              </div>
            </div>
            <hr />

            {/* 9. 비고(기타정보) */}
            <h3>비고</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>기타</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.specialnote || "정보 없음"}</span>
                </div>
              </div>
            </div>
          </>
        );
      }

    case "loading":
      console.log("loading");
      return <></>;

    case "hasError":
      throw userselectordata.contents;
  }
}

export default withAuth(Search);
