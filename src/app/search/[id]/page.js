"use client";
import styles from "@/styles/Userinfo.module.scss";
import { useParams, usePathname } from "next/navigation";
import { useRecoilValueLoadable, useSetRecoilState, useRecoilRefresher_UNSTABLE } from "recoil";
import { userinfoSelector } from "@/utils/selector";
import { useEffect } from "react";
import { useridState } from "@/utils/atom";
import { DownloadButton, Button } from "@/components/Button";
import Link from "next/link";
import withAuth from "@/utils/hoc/withAuth";
import { FaEdit } from "react-icons/fa";
import categoryMapping from "@/utils/categoryMapping";

function Search() {
  const params = useParams();
  const userid = params.id;
  const setIdState = useSetRecoilState(useridState);

  // userinfoSelector를 강제로 재실행하기 위한 refresher
  const refreshUserInfo = useRecoilRefresher_UNSTABLE(userinfoSelector);

  useEffect(() => {
    if (userid) {
      setIdState(userid);
      // 페이지 마운트 시 강제로 selector 재실행
      refreshUserInfo();
    } else {
      console.error("유효하지 않은 사용자 ID입니다.");
    }
  }, [userid, setIdState, refreshUserInfo]);

  const userselectordata = useRecoilValueLoadable(userinfoSelector);
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const sortMapping = categoryMapping;

  const getFileName = (filePath) => {
    if (!filePath) return "";
    return filePath.split(/[/\\]/).pop();
  };

  // 콤마 삽입 함수
  const formatNumberWithComma = (num) => {
    if (num == null) return "정보 없음";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (!userid) {
    return null;
  }

  switch (userselectordata.state) {
    case "hasValue":
      const userdata = userselectordata.contents;
      if (!userdata)
        return (
          <>
            <h1>잘못된 접근입니다</h1>
          </>
        );
      else
        return (
          <>
            <h3>회원 정보</h3>
            <Link href={`/modify/${userid}`} passHref>
              <button className={styles.editButton}>
                <FaEdit className={styles.editIcon} />
                수정
              </button>
            </Link>
            <div className={styles.rowcontainer}>
              {/* 관리번호 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>관리번호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.id || "정보 없음"}</span>
                </div>
              </div>
              {/* 성명 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>성명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.customerData?.name || "정보 없음"}</span>
                </div>
              </div>
              {/* 주민번호 */}
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
              {/* 이메일 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>이메일</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.customerData?.email || "정보 없음"}</span>
                </div>
              </div>
              {/* 휴대전화 */}
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
              {/* 타입 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>타입</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.type || "정보 없음"}</span>
                </div>
              </div>
              {/* 군 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>군</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.groupname || "정보 없음"}</span>
                </div>
              </div>
              {/* 순번 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>순번</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.turn || "정보 없음"}</span>
                </div>
              </div>
              {/* 가입차순 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>가입차순</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.batch || "정보 없음"}</span>
                </div>
              </div>
              {/* 분류 */}
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
              {/* 가입일자 */}
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
              {/* 가입가 */}
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
              {/* 예약금 납입일자 */}
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
              {/* 예약금 */}
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
              {/* 법정주소 */}
              <div className={styles.postunitbody}>
                <div className={styles.posttitlebody}>
                  <span className={styles.title}>법정주소</span>
                </div>
                <div className={styles.postcontentbody}>
                  <span>
                    {userdata.legalAddress?.detailaddress || "정보 없음"}
                  </span>
                </div>
              </div>
              {/* 우편물 수령주소 */}
              <div className={styles.postunitbody}>
                <div className={styles.posttitlebody}>
                  <span className={styles.title}>우편물 수령주소</span>
                </div>
                <div className={styles.postcontentbody}>
                  <span>
                    {userdata.postreceive?.detailaddressreceive || "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              {/* 은행명 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>은행명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.financial?.bankname || "정보 없음"}</span>
                </div>
              </div>
              {/* 계좌번호 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>계좌번호</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.financial?.accountnum || "정보 없음"}</span>
                </div>
              </div>
              {/* 예금주 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>예금주</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.financial?.accountholder || "정보 없음"}</span>
                </div>
              </div>
            </div>

            <div className={styles.rowcontainer}>
              {/* 7차 면제 */}
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
              {/* 출자금 */}
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
              {/* 지산A동 계약서 */}
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
              {/* 총괄 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>총괄</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.responsible?.generalmanagement || "정보 없음"}</span>
                </div>
              </div>
              {/* 본부 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>본부</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.responsible?.division || "정보 없음"}</span>
                </div>
              </div>
              {/* 팀 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>팀</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.responsible?.team || "정보 없음"}</span>
                </div>
              </div>
              {/* 담당자 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>담당자</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.responsible?.managername || "정보 없음"}</span>
                </div>
              </div>
            </div>
            <h1></h1>
            <hr />

            <h3>납입차수 정보</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <table className={styles.phase_table}>
                  <thead>
                    <tr>
                      <th>차수</th>
                      <th>예정일자</th>
                      <th>완납일자</th>
                      <th>부담금</th>
                      <th>업무 대행비</th>
                      <th>지불한 금액</th>
                      <th>이동</th>
                      <th>n차합</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userdata.phases && userdata.phases.length > 0 ? (
                      userdata.phases.map((phase) => (
                        <tr key={phase.id}>
                          <td>{phase.phaseNumber || "N/A"}</td>
                          <td>{phase.planneddate ? phase.planneddate.slice(0,10) : "N/A"}</td>
                          <td>{phase.fullpaiddate ? phase.fullpaiddate.slice(0,10) : "N/A"}</td>
                          <td>
                            {phase.charge
                              ? formatNumberWithComma(phase.charge)
                              : "N/A"}
                          </td>
                          <td>
                            {phase.service
                              ? formatNumberWithComma(phase.service)
                              : "N/A"}
                          </td>
                          <td>
                            {phase.charged
                              ? formatNumberWithComma(phase.charged)
                              : "N/A"}
                          </td>
                          <td>{phase.move || "N/A"}</td>
                          <td>
                            {formatNumberWithComma(
                              userdata.phases
                                .filter(p => p.phaseNumber === phase.phaseNumber)
                                .reduce((sum, p) => sum + (p.feesum || 0), 0)
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">Phase 정보가 없습니다.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className={styles.phase_sum}>
                  <span>
                    n차합:{" "}
                    {formatNumberWithComma(
                      userdata.phases
                        ? userdata.phases.reduce((sum, phase) => sum + (phase.feesum || 0), 0)
                        : 0
                    )}
                  </span>
                </div>
              </div>
            </div>

            <h3>대출 및 자납 정보</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody} style={{ width: "100%" }}>
                <table className={styles.loan_table}>
                  <thead>
                    <tr>
                      <th>일자</th>
                      <th>은행</th>
                      <th>대출액</th>
                      <th>자납일</th>
                      <th>자납액</th>
                      <th>합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userdata.loan ? (
                      <tr>
                        <td>{userdata.loan.loandate ? userdata.loan.loandate.slice(0,10) : "N/A"}</td>
                        <td>{userdata.loan.loanbank || "정보 없음"}</td>
                        <td>
                          {userdata.loan.loanammount
                            ? formatNumberWithComma(userdata.loan.loanammount)
                            : "N/A"}
                        </td>
                        <td>{userdata.loan.selfdate ? userdata.loan.selfdate.slice(0,10) : "N/A"}</td>
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

            <h3>총 면제금액</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>총 면제금액</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.phases
                      ? formatNumberWithComma(
                          userdata.phases.reduce((sum, phase) => sum + (phase.exemption || 0), 0)
                        )
                      : "0"}
                  </span>
                </div>
              </div>
            </div>

            {userdata.customertype === 'x' && (
              <>
                <h3>해약 고객 정보</h3>
                <div className={styles.rowcontainer}>
                  {/* 해지일자 */}
                  <div className={styles.unitbody}>
                    <div className={styles.titlebody}>
                      <span className={styles.title}>해지일자</span>
                    </div>
                    <div className={styles.contentbody}>
                      <span>정보 없음</span>
                    </div>
                  </div>
                  {/* 환급일자 */}
                  <div className={styles.unitbody}>
                    <div className={styles.titlebody}>
                      <span className={styles.title}>환급일자</span>
                    </div>
                    <div className={styles.contentbody}>
                      <span>정보 없음</span>
                    </div>
                  </div>
                  {/* 환급금 */}
                  <div className={styles.unitbody}>
                    <div className={styles.titlebody}>
                      <span className={styles.title}>환급금</span>
                    </div>
                    <div className={styles.contentbody}>
                      <span>정보 없음</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <h3>납입 총액</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>납입 총액</span>
                </div>
                <div className={styles.contentbody}>
                  <span>
                    {userdata.phases
                      ? formatNumberWithComma(
                          userdata.phases.reduce((sum, phase) => sum + (phase.charged || 0), 0)
                        )
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
            <h1></h1>
            <hr />

            <h3>MGM</h3>
            <div className={styles.rowcontainer}>
              {/* 업체명 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>업체명</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgmcompanyname || "정보 없음"}</span>
                </div>
              </div>
              {/* 이름 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>이름</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgmname || "정보 없음"}</span>
                </div>
              </div>
              {/* 기관 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>기관</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgminstitution || "정보 없음"}</span>
                </div>
              </div>
              {/* 계좌 */}
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>계좌</span>
                </div>
                <div className={styles.contentbody}>
                  <span>{userdata.mgm?.mgmaccount || "정보 없음"}</span>
                </div>
              </div>
            </div>
            <h1></h1>
            <hr />

            <h3>부속서류</h3>
            <div className={styles.rowcontainer}>
              <div className={styles.unitbody}>
                <div className={styles.titlebody}>
                  <span className={styles.title}>부속 서류</span>
                </div>
                <div className={styles.contentbody}>
                  {userdata.attachments?.isuploaded && userdata.attachments?.fileinfo ? (
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
                  <ul>
                    <li>
                      <span>인감증명서</span>
                      {userdata.attachments?.sealcertificateprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>본인서명확인서</span>
                      {userdata.attachments?.selfsignatureconfirmationprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>신분증</span>
                      {userdata.attachments?.idcopyprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>확약서</span>
                      {userdata.attachments?.commitmentletterprovided ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>창준위용</span>
                      {userdata.attachments?.forfounding ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>무상옵션</span>
                      {userdata.attachments?.freeoption ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>선호도조사</span>
                      {userdata.attachments?.preferenceattachment ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>총회동의서</span>
                      {userdata.attachments?.agreement ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                    <li>
                      <span>사은품</span>
                      {userdata.attachments?.prizeattachment ? (
                        <span>✔️</span>
                      ) : (
                        <span>❌</span>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h1></h1>
            <hr />

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

            <h3>기타 정보</h3>
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

    case "loading":
      console.log("loading");
      return <></>;

    case "hasError":
      throw userselectordata.contents;
  }
}

export default withAuth(Search);
