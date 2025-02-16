// src/app/inputmoney/payinfo/[id]/[cha].js
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { userinfoSelector } from "@/utils/selector";
import { useridState, chasuState } from "@/utils/atom";
import { useRecoilValueLoadable, useRecoilState } from "recoil";
import { fetchPhaseData, updatePhaseDataPartial } from "@/utils/api";
import { Inputbox2, Inputbox_M } from "@/components/Inputbox";
import { Button_Y, Button_N } from "@/components/Button";
import styles from "@/styles/Inputmoneypay.module.scss";
import { BsDatabase } from "react-icons/bs";
import withAuth from "@/utils/hoc/withAuth";

// 숫자 포맷 함수
const formatNumber = (value) => {
  if (!value) return "0";
  const numberString = value.toString().replace(/[^0-9]/g, "");
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseNumber = (value) => {
  if (!value) return "0";
  return value.toString().replace(/,/g, "");
};

function Inputmoneypay() {
  const { register, handleSubmit, setValue, watch } = useForm();
  // 수정 가능한 필드들
  const [charge, setCharge] = useState("0");       // 부담금
  const [service, setService] = useState("0");     // 업무대행비
  const [discount, setDiscount] = useState("0");   // 할인액
  const [exemption, setExemption] = useState("0"); // 면제액
  const [move, setMove] = useState("");            // 이동

  // 읽기 전용 필드
  const [charged, setCharged] = useState("0");     // 납입금액 (수정 불가)
  const [feesum, setFeesum] = useState(0);         // 총액 (계산용)
  const [total, setTotal] = useState(0);           // 남은금액 (계산용)

  const pathname = usePathname();
  const router = useRouter();

  const [IdState, setIdState] = useRecoilState(useridState);
  const [ChasuState, setChasuState] = useRecoilState(chasuState);
  const [phaseId, setPhaseId] = useState(null);
  const [userChasuData, setUserChasuData] = useState(null);

  const [userData, setUserData] = useState(null);
  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  // URL에서 userid와 chasu 추출
  useEffect(() => {
    const regex = /\/(\d+)\/(\d+)$/;
    const match = pathname.match(regex);

    if (match) {
      const extractedId = parseInt(match[1], 10);
      const extractedChasu = parseInt(match[2], 10);
      setIdState(extractedId);
      setChasuState(extractedChasu);
    }
  }, [pathname, setIdState, setChasuState]);

  // 사용자 정보 가져오기
  useEffect(() => {
    if (userselectordata.state === "hasValue") {
      const userdata = userselectordata.contents;
      if (userdata === undefined) {
        console.log("잘못된 접근입니다");
      } else {
        setUserData(userdata);
      }
    }
  }, [userselectordata]);

  // Phase 데이터 가져오기
  useEffect(() => {
    if (IdState && ChasuState) {
      fetchPhaseData(IdState, ChasuState)
        .then((phase) => {
          console.log(phase);
          if (phase) {
            setUserChasuData(phase);
            setPhaseId(phase.id);
            setCharge(formatNumber(phase.charge));
            setService(formatNumber(phase.service));
            setDiscount(formatNumber(phase.discount));
            setExemption(formatNumber(phase.exemption));
            setMove(phase.move || "");
            setCharged(formatNumber(phase.charged));
          } else {
            console.log("해당 차수가 존재하지 않습니다.");
          }
        })
        .catch((error) => {
          console.error("Phase 데이터를 가져오는 중 오류 발생:", error);
        });
    }
  }, [IdState, ChasuState]);

  // 남은금액 및 총액 계산 (수정 가능한 값 기준)
  useEffect(() => {
    calculateTotal();
  }, [charge, service, discount, exemption, charged]);

  const calculateTotal = () => {
    const chargeValue = parseInt(parseNumber(charge)) || 0;
    const serviceValue = parseInt(parseNumber(service)) || 0;
    const discountValue = parseInt(parseNumber(discount)) || 0;
    const exemptionValue = parseInt(parseNumber(exemption)) || 0;
    const chargedValue = parseInt(parseNumber(charged)) || 0;

    const feesumValue = chargeValue + serviceValue - discountValue - exemptionValue;
    setFeesum(feesumValue);

    const totalValue = feesumValue - chargedValue;
    setTotal(totalValue);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = formatNumber(value);

    switch (name) {
      case "charge":
        setCharge(formattedValue === "0" ? "" : formattedValue);
        break;
      case "service":
        setService(formattedValue === "0" ? "" : formattedValue);
        break;
      case "discount":
        setDiscount(formattedValue === "0" ? "" : formattedValue);
        break;
      case "exemption":
        setExemption(formattedValue === "0" ? "" : formattedValue);
        break;
      case "move":
        setMove(value);
        break;
      default:
        break;
    }
  };

  // 제출 시 수정 가능한 필드만 전송 (납입금액은 수정하지 않음)
  const onSubmit = (data) => {
    const partialData = {
      charge: parseNumber(charge),
      service: parseNumber(service),
      discount: parseNumber(discount),
      exemption: parseNumber(exemption),
      move: move,
    };

    if (IdState && ChasuState) {
      updatePhaseDataPartial(IdState, ChasuState, partialData)
        .then(() => {
          router.push(`/inputmoney/userinfo/${IdState}`);
        })
        .catch((error) => {
          console.error("Phase 업데이트 중 오류 발생:", error);
        });
    } else {
      console.error("유효한 고객 ID 또는 차수 정보가 없습니다.");
    }
  };

  // planneddate, fullpaiddate 등은 읽기 전용으로 처리
  const plannedDateValue =
    userChasuData &&
    userChasuData.planneddate &&
    userChasuData.planneddate.match(/^\d{4}-\d{2}-\d{2}$/)
      ? userChasuData.planneddate
      : "";
  const fullPaidDateValue =
    userChasuData &&
    userChasuData.fullpaiddate &&
    userChasuData.fullpaiddate.match(/^\d{4}-\d{2}-\d{2}$/)
      ? userChasuData.fullpaiddate
      : "";

  return (
    <>
      {userChasuData &&
        userselectordata.state === "hasValue" &&
        userData && (
          <div className={styles.Container}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.Mainbody}>
                <div className={styles.MainTitle}>
                  <div className={styles.MainTitle1}>
                    <div className={styles.SearchClientNum}>
                      <div className={styles.SearchFont1}>회원번호 : </div>
                      <div className={styles.SearchFont2}>{IdState}</div>
                    </div>
                    <div className={styles.SearchClientNum}>
                      <div className={styles.SearchFont1}>성함 : </div>
                      <div className={styles.SearchFont2}>
                        {userData.customerData?.name}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.InputBody}>
                  <div className={styles.InputBodyTitle}>
                    <div className={styles.IBTIcon}>
                      <div className={styles.Icon} style={{ color: "#7152F3" }}>
                        <BsDatabase style={{ width: "100%", height: "100%" }} />
                      </div>
                    </div>
                    <div className={styles.IBTText}>
                      {ChasuState}차 납입
                    </div>
                  </div>
                  <div className={styles.Line}></div>

                  {/* 예정일자, 완납일자는 읽기 전용 */}
                  <div className={styles.SIBLayer}>
                    <div className={styles.SearchFont}>완납일자</div>
                    <Inputbox2
                      type="date"
                      {...register("fullpaiddate")}
                      defaultValue={fullPaidDateValue}
                      readOnly
                    />
                  </div>
                  <div className={styles.SIBLayer}>
                    <div className={styles.SearchFont}>예정일자</div>
                    <Inputbox2
                      type="date"
                      {...register("planneddate")}
                      defaultValue={plannedDateValue}
                      readOnly
                    />
                  </div>
                  {/* 수정 가능한 필드 */}
                  <div className={styles.IBLayer}>
                    <Inputbox_M
                      type="text"
                      placeholder="부담금"
                      name="charge"
                      {...register("charge")}
                      onChange={onChange}
                      value={charge}
                    />
                    <Inputbox_M
                      type="text"
                      placeholder="업무대행비"
                      name="service"
                      {...register("service")}
                      onChange={onChange}
                      value={service}
                    />
                  </div>
                  <div className={styles.IBLayer}>
                    <Inputbox_M
                      type="text"
                      placeholder="할인액"
                      name="discount"
                      {...register("discount")}
                      onChange={onChange}
                      value={discount}
                    />
                    <Inputbox_M
                      type="text"
                      placeholder="면제액"
                      name="exemption"
                      {...register("exemption")}
                      onChange={onChange}
                      value={exemption}
                    />
                  </div>
                  <div className={styles.IBLayer}>
                    <Inputbox_M
                      type="text"
                      placeholder="이동"
                      name="move"
                      {...register("move")}
                      onChange={onChange}
                      value={move}
                    />
                    {/* 납입금액은 readOnly */}
                    <Inputbox_M
                      type="text"
                      placeholder="납입금액"
                      name="charged"
                      {...register("charged")}
                      value={charged}
                      readOnly
                    />
                  </div>
                  <div className={styles.IBLayer}>
                    <div className={styles.IBInputBox_S}>
                      <div className={styles.SearchFont1}>총액 :</div>
                      <div className={styles.SearchFont2}>
                        {feesum.toLocaleString()}₩
                      </div>
                    </div>
                  </div>
                  <div className={styles.IBLayer}>
                    <div className={styles.IBInputBox_S}>
                      <div className={styles.SearchFont1}>남은금액 :</div>
                      <div className={styles.SearchFont2}>
                        {total.toLocaleString()}₩
                      </div>
                    </div>
                  </div>
                  <div className={styles.IBBottonLayer}>
                    <Link href={`/inputmoney/userinfo/${IdState}`}>
                      <Button_N type="button">
                        <div className={styles.BottonFont2}>취소</div>
                      </Button_N>
                    </Link>
                    <Button_Y type="submit">
                      <div className={styles.BottonFont}>확인</div>
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

export default withAuth(Inputmoneypay);
