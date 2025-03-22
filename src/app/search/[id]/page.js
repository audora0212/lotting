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
import { DownloadButton, LinkButton } from "@/components/Button";
import withAuth from "@/utils/hoc/withAuth";
import { FaEdit, FaFileInvoice } from "react-icons/fa";
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
    console.log(1);
    if (!userid) return;
    downloadFormat1(userid);
  };

  const handleDownloadFormat2 = () => {
    if (!userid) return;
    downloadFormat2(userid);
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone.length !== 8) return phone || "정보 없음";
    return `010)${phone.slice(0, 4)}-${phone.slice(4)}`;
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
        // 대출 및 자납 정보의 합계 계산
        const loanAmount = userdata.loan?.loanammount;
        const selfAmount = userdata.loan?.selfammount;
        let totalLoanSelf = null;
        console.log(userdata.phases)
        if (loanAmount != null && selfAmount != null) {
          totalLoanSelf = loanAmount + selfAmount;
        } else if (loanAmount != null) {
          totalLoanSelf = loanAmount;
        } else if (selfAmount != null) {
          totalLoanSelf = selfAmount;
        }

        return (
          <>
            {/* 1. 회원정보 */}
            <h3></h3>

            <div className={styles.buttonContainer}>
              {/* 일반 신청서 다운로드 버튼 */}
              <button
                className={styles.contractButton}
                onClick={handleDownloadFormat1}
              >
                <FaFileInvoice className={styles.editIcon} />
                일반 신청서
              </button>
              {/* 일반 부속 서류 다운로드 버튼 */}
              <button
                className={styles.contractButton}
                onClick={handleDownloadFormat2}
              >
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
                <span>
                    {userdata.customerData?.phone
                      ? formatPhoneNumber(userdata.customerData.phone)
                      : "정보 없음"}
                  </span>
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
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>신탁사제출일</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.financial?.trustcompanydate
                      ? userdata.financial.trustcompanydate.slice(0, 10)
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
                    우편번호:{" "}
                    {userdata.legalAddress?.postnumber || "정보 없음"}
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

            {/* 다힘 */}
            <hr />


            {/* 납입금 관리 */}
            <hr />
            <h3>납입금 관리</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.linkbutton}>
                <Link href={`/inputmoney/userinfo/${splitpath[2]}`}>
                  <LinkButton>바로가기</LinkButton>
                </Link>
              </div>
            </div>
            <hr />

            {/* 납입차수 정보 */}
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
                          phaseNumber:
                            (userdata.phases?.length || 0) + i + 1,
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
                          style={{
                            cursor: isOverdue ? "pointer" : "default",
                          }}
                          onClick={handleRowClick}
                        >
                          <td>{phase.phaseNumber || "없음"}</td>
                          <td>
                            {phase.planneddate
                              ? parseInt(phase.planneddate.slice(0, 4), 10) > 2099
                                  ? phase.planneddateString
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
                                      (p) =>
                                        p.phaseNumber === phase.phaseNumber
                                    )
                                    .reduce(
                                      (sum, p) => sum + (p.feesum || 0),
                                      0
                                    )
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

            {/* 대출 및 자납 정보 */}
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
                          {totalLoanSelf != null
                            ? formatNumberWithComma(totalLoanSelf)
                            : "정보 없음"}
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

            {/* 총 면제금액 및 납입 총액 */}
            <h3>총 면제금액 및 납입 총액</h3>
            <div className={styles.rowcontainer}>
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

            {/* 부속서류 */}
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
                      {userdata.attachments?.selfsignatureconfirmationprovided ? (
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

            
            {/* 비고 */}
            <hr />
            <h3>비고</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>기타</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.additional || "정보 없음"}</span>
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
                    <span>
                      {userdata.attachments?.prizename || "정보 없음"}
                    </span>
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
            <h3>다힘</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>시상</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimsisang || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>일자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimdate || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>6/30선지급</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimprepaid || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>1회차청구</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimfirst || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>금액(만원)</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimfirstpay || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>일자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimdate2 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>출처</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimsource || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>2회차청구</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimsecond || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>금액(만원)</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimsecondpay || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>일자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.dahim?.dahimdate3 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>합계(만원)</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {totalLoanSelf != null
                      ? formatNumberWithComma(totalLoanSelf)
                      : "정보 없음"}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            {/* MGM */}
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

            {/* 1차(직원) */}
            <h3>1차(직원)</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>차순</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.firstemp?.firstemptimes || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>지급일</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.firstemp?.firstempdate || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            {/* 2차(직원) */}
            <h3>2차(직원)</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>차순</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.secondemp?.secondemptimes || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>지급일</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.secondemp?.secondempdate || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>
            <hr />


            {/* 총회 참석여부 */}
            <h3>총회 참석 여부</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>서면</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.meetingattend?.ftofattend || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>직접</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.meetingattend?.selfattend || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>대리</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.meetingattend?.behalfattend || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>
            <hr />

            {/* 안건 */}
            <h3>안건</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제1호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda1 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제2-1호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda2_1 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제2-2호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda2_2 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제2-3호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda2_3 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제2-4호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda2_4 || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제3호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda3 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제4호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda4 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제5호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda5 || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제6호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda6 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제7호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda7 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제8호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda8 || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제9호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda9 || "정보 없음"}
                  </span>
                </div>
              </div>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>제10호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.agenda?.agenda10 || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>
            <hr />
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
