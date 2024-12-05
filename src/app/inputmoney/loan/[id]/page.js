"use client";
// src/app/inputmoney/loan/[id].js

import {
  Inputbox,
  Inputbox_L,
  Inputbox_M,
  PostInputbox,
  LongInputbox,
  DropInputbox,
  FileInputbox,
  Spanbox,
} from "@/components/Inputbox";
import {
  PaymentScheduleButton,
  ToggleButton,
  SearchButton,
  Button_Y,
  Button_N,
} from "@/components/Button";
import { useForm } from "react-hook-form";
import styles from "@/styles/Inputmoneyloan.module.scss";
import { BsDatabase } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useridState } from "@/utils/atom";
import { useRecoilValueLoadable, useRecoilState } from "recoil";
import { userinfoSelector, usermoneySelector } from "@/utils/selector";
import { usePathname, useRouter } from "next/navigation";
import { fetchLoanInit, fetchLoanUpdate } from "@/utils/api";
import withAuth from "@/utils/hoc/withAuth";

function Inputmoneyloan() {
  const router = useRouter();

  const [loandate, setLoandate] = useState("");
  const [selfdate, setSelfdate] = useState("");

  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [selfprice, setSelfprice] = useState("");

  const [tot, settot] = useState(0);
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState(null);
  const [IdState, setIdState] = useRecoilState(useridState);
  const userselectordata = useRecoilValueLoadable(userinfoSelector);
  const { register, setValue, handleSubmit } = useForm();
  const pathname = usePathname();

  useEffect(() => {
    const regex = /\/(\d+)$/;
    const match = pathname.match(regex);
    if (match) {
      const extractedId = parseInt(match[1], 10);
      setIdState(extractedId);
    }
  }, [pathname, setIdState]);

  const onSubmit = (formData) => {
    // Backend Loan 엔티티에 맞추어 데이터 구조 조정
    const loanammount = parseInt(price1, 10) + parseInt(price2, 10);
    const selfammount = parseInt(selfprice, 10);
    const loanselfsum = loanammount + selfammount;

    const updatedData = {
      loandate: loandate,
      loanbank: "농협, 새마을", // 여러 대출 은행을 지원하려면 하나의 필드로 조합
      loanammount: loanammount,
      selfdate: selfdate,
      selfammount: selfammount,
      loanselfsum: loanselfsum,
      loanselfcurrent: loanselfsum, // 현재 남은 금액을 단순히 합계로 설정
    };

    console.log("Updated Loan Data:", updatedData, "UserID:", IdState);

    fetchLoanUpdate(IdState, updatedData, () => {
      router.back();
    });
  };

  useEffect(() => {
    fetchData();
  }, [IdState]);

  const fetchData = async () => {
    try {
      const fetchedData = await fetchLoanInit(IdState);
      setData(fetchedData);
      console.log("Fetched Loan Data:", fetchedData);
      setLoandate(fetchedData.loandate ? fetchedData.loandate.substring(0, 10) : "");
      setSelfdate(fetchedData.selfdate ? fetchedData.selfdate.substring(0, 10) : "");
      setPrice1(fetchedData.loanammount ? (fetchedData.loanammount / 2).toString() : ""); // 임시: 두 은행으로 나누어 표시
      setPrice2(fetchedData.loanammount ? (fetchedData.loanammount / 2).toString() : ""); // 임시: 두 은행으로 나누어 표시
      setSelfprice(fetchedData.selfammount ? fetchedData.selfammount.toString() : "");
      settot(fetchedData.loanselfsum || 0);
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  useEffect(() => {
    if (userselectordata.state === "hasValue") {
      const userdata = userselectordata.contents;
      if (userdata === undefined) {
        console.error("잘못된 접근입니다");
      } else {
        setUserData(userdata);
      }
    }
  }, [userselectordata]);

  useEffect(() => {
    calculateTotal();
  }, [price1, price2, selfprice]);

  const calculateTotal = () => {
    const price1Value = parseInt(price1, 10) || 0;
    const price2Value = parseInt(price2, 10) || 0;
    const selfpriceValue = parseInt(selfprice, 10) || 0;
    const total = price1Value + price2Value + selfpriceValue;
    settot(total);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "price1":
        setPrice1(value);
        break;
      case "price2":
        setPrice2(value);
        break;
      case "selfprice":
        setSelfprice(value);
        break;
      case "loandate":
        setLoandate(value);
        break;
      case "selfdate":
        setSelfdate(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {userselectordata.state === "hasValue" && userData && (
        <div className={styles.Container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.Mainbody}>
              <div className={styles.MainTitle}>
                <div className={styles.MainTitle1}>
                  <div className={styles.SearchClientNum}>
                    <div className={styles.SearchFont1}>고객번호 : </div>
                    <div className={styles.SearchFont2}>{userData.id}</div>
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
                    defaultValue={loandate}
                    {...register("loandate")}
                  />
                </div>
                <div className={styles.IBLayer}>
                  <div className={styles.IBTText2}>
                    <div className={styles.IBTText2Font}>농협</div>
                  </div>
                  <Inputbox_L
                    type="text"
                    placeholder="농협 대출금"
                    name="price1"
                    onChange={onChange}
                    {...register("price1")}
                    value={price1}
                  />
                </div>
                {/* 새마을 대출 섹션 */}
                <div className={styles.IBLayer}>
                  <div className={styles.IBTText2}>
                    <div className={styles.IBTText2Font}>새마을</div>
                  </div>
                  <Inputbox_L
                    type="text"
                    placeholder="새마을대출금"
                    name="price2"
                    onChange={onChange}
                    {...register("price2")}
                    value={price2}
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
                    defaultValue={selfdate}
                    {...register("selfdate")}
                  />
                </div>

                <div className={styles.IBLayer}>
                  <div className={styles.IBTText2}>
                    <div className={styles.IBTText2Font}>자납액</div>
                  </div>
                  <Inputbox_L
                    type="text"
                    placeholder="자납"
                    name="selfprice"
                    onChange={onChange}
                    {...register("selfprice")}
                    value={selfprice}
                  />
                </div>

                {/* 총액 섹션 */}
                <div className={styles.InputBodyTitle}>
                  <div className={styles.IBTIcon}>
                    <div className={styles.Icon} style={{ color: "#7152F3" }}>
                      <BsDatabase style={{ width: "100%", height: "100%" }} />
                    </div>
                  </div>
                  <div className={styles.IBTText}>총액</div>
                </div>

                <div className={styles.IBLayer}>
                  <div className={styles.SearchFont1}>총액 :</div>
                  <div className={styles.SearchFont2}>
                    {tot.toLocaleString()}₩
                  </div>
                </div>

                {/* 버튼 섹션 */}
                <div className={styles.IBBottonLayer}>
                  <Button_N type="button" onClick={() => router.back()}>
                    <div className={styles.BottonFont2}>취소</div>
                  </Button_N>
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

export default withAuth(Inputmoneyloan);
