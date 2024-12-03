"use client";
import Mininav from "@/components/Mininav";
import styles from "@/styles/Userinfo.module.scss";
import { useParams } from "next/navigation"; // useParams 훅 추가
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { userinfoSelector } from "@/utils/selector";
import { useEffect } from "react"; // useEffect로 변경
import { useridState } from "@/utils/atom";
import { DownloadButton, Button } from "@/components/Button";
import Link from "next/link";
import { Inputbox, InputAreabox } from "@/components/Inputbox";
import withAuth from "@/utils/hoc/withAuth";
import { usePathname } from "next/navigation";

function Search() {
  const params = useParams();
  const userid = params.id;
  const setIdState = useSetRecoilState(useridState);

  useEffect(() => {
    if (userid) {
      setIdState(userid);
    } else {
      console.error("유효하지 않은 사용자 ID입니다.");
    }
  }, [userid, setIdState]);

  const userselectordata = useRecoilValueLoadable(userinfoSelector);
  const pathname = usePathname();
  const splitpath = pathname.split("/"); //splitpath[3]
  const sortMapping = {
    1: "정계약",
    c: "청약",
    j: "정계약",
    r: "수정",
    x: "해지",
    x1: "해지",
    p: "업대",
    p1: "업대",
    t: "창준위",
    t1: "창준위",
    g: "지주",
  };

  switch (userselectordata.state) {
    case "hasValue":
      const userdata = userselectordata.contents;
      console.log(userdata);
      if (userdata === undefined)
        return (
          <>
            <h1>잘못된 접근입니다</h1>
          </>
        );
      else
        return (
          <>
            <h3>회원정보</h3>
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

            {/* 관리 정보 */}
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

            {/* 가입 및 예약금 정보 */}
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
                      ? userdata.registerprice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                      ? userdata.deposits.depositammount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "정보 없음"}
                  </span>
                </div>
              </div>
            </div>

            {/* 주소 정보 */}
            <div className={styles.rowcontainer}>
              {/* 법정주소 */}
              <div className={styles.postunitbody}>
                <div className={styles.posttitlebody}>
                  <span className={styles.title}>법정주소</span>
                </div>
                <div className={styles.postcontentbody}>
                  <span>{userdata.legalAddress?.detailaddress || "정보 없음"}</span>
                </div>
              </div>
              {/* 우편물 수령주소 */}
              <div className={styles.postunitbody}>
                <div className={styles.posttitlebody}>
                  <span className={styles.title}>우편물 수령주소</span>
                </div>
                <div className={styles.postcontentbody}>
                  <span>{userdata.postreceive?.detailaddressreceive || "정보 없음"}</span>
                </div>
              </div>
            </div>

            {/* 금융 정보 */}
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

            {/* 부속서류 */}
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

            {/* 담당자 정보 */}
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

            {/* MGM 정보 */}
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

            {/* 부속서류 */}
            <h3>부속서류</h3>
            <div className={styles.file_container}>
              {userdata.attachments?.isuploaded ? (
                <DownloadButton userid={userid} filename="upload">
                  부속 서류
                </DownloadButton>
              ) : (
                <>
                  <div className={styles.A}>
                    <p>부속 서류</p>
                    <p>파일이 없습니다.</p>
                  </div>
                </>
              )}

              <div className={styles.file_status}>
                <ul>
                  <li>
                    <span>인감증명서 </span>
                    {userdata.attachments?.sealcertificateprovided ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>본인서명확인서 </span>
                    {userdata.attachments?.selfsignatureconfirmationprovided ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>신분증 </span>
                    {userdata.attachments?.idcopyprovided ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>확약서 </span>
                    {userdata.attachments?.commitmentletterprovided ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                </ul>
              </div>
              <div className={styles.file_status}>
                <ul>
                  <li>
                    <span>창준위용 </span>
                    {userdata.attachments?.forfounding ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>무상옵션 </span>
                    {userdata.attachments?.freeoption ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>선호도조사 </span>
                    {userdata.attachments?.preferenceattachment ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>총회동의서 </span>
                    {userdata.attachments?.agreement ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                  <li>
                    <span>사은품 </span>
                    {userdata.attachments?.prizeattachment ? (
                      <span>✔️</span>
                    ) : (
                      <span>❌</span>
                    )}
                  </li>
                </ul>
              </div>
            </div>
            <h1></h1>
            <hr />

            {/* 납입금 관리 */}
            <h3>납입금 관리</h3>
            <div className={styles.linkbutton}>
              <Link href={"/inputmoney/userinfo/" + splitpath[3]}>
                <Button>
                  <h3>바로가기</h3>
                </Button>
              </Link>
            </div>
            <hr />

            {/* 기타 정보 */}
            <h3>기타 정보</h3>
            <div>
              <InputAreabox value={userdata.specialnote || "정보 없음"} />
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
