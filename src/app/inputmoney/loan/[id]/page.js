"use client";

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
      const extractedId = match[1];
      setIdState(extractedId);
    }
  }, [pathname, setIdState, IdState]);

  const onSubmit = (data) => {
    data["price1"] = price1;
    data["price2"] = price2;
    data["selfprice"] = parseInt(selfprice);
    data["sumprice"] = tot;
    console.log(data, IdState);

    fetchLoanUpdate(IdState, data, () => {
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
      console.log("fetchdata : ", fetchedData);
      setLoandate(fetchedData.loandate);
      setSelfdate(fetchedData.selfdate);
      setPrice1(fetchedData.price1);
      setPrice2(fetchedData.price2);
      setSelfprice(fetchedData.selfprice);
      settot(fetchedData.sumprice);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    const price1Value = parseInt(price1) || 0;
    const price2Value = parseInt(price2) || 0;
    const selfpriceValue = parseInt(selfprice) || 0;
    const total = price1Value + price2Value + selfpriceValue;
    settot(total);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "price1": // 수정: name 속성을 price1, price2와 일치하도록 수정
        setPrice1(value);
        break;
      case "price2": // 수정: name 속성을 price1, price2와 일치하도록 수정
        setPrice2(value);
        break;
      case "selfprice": // 수정: name 속성을 selfprice와 일치하도록 수정
        setSelfprice(value);
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
                <div className={styles.MainTitle2}>
                  <Link href="/inputmoney">
                    <SearchButton>
                      <div
                        className={styles.BottonIcon}
                        style={{ color: "white" }}
                      >
                        <CgSearch style={{ width: "100%", height: "100%" }} />
                      </div>
                      <div className={styles.BottonFont}>고객선택</div>
                    </SearchButton>
                  </Link>
                </div>
              </div>
              <div className={styles.InputBody}>
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
                    defaultValue={
                      loandate
                        ? new Date(loandate).toISOString().substring(0, 10)
                        : 0
                    }
                    register={register("loandate")}
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
                    register={register("price1")}
                    defaultValue={price1}
                  />
                </div>
                {/* 한 덩어리 */}

                <div className={styles.IBLayer}>
                  <div className={styles.IBTText2}>
                    <div className={styles.IBTText2Font}>새마을</div>
                  </div>
                  <Inputbox_L
                    type="text"
                    placeholder="새마을대출금"
                    name="price2"
                    onChange={onChange}
                    register={register("price2")}
                    defaultValue={price2}
                  />
                </div>
                {/* 한 덩어리 */}

                {/* 한 덩어리 */}
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
                    defaultValue={
                      selfdate
                        ? new Date(selfdate).toISOString().substring(0, 10)
                        : 0
                    }
                    register={register("selfdate")}
                  />
                </div>
                {/* 한 덩어리 */}

                <div className={styles.IBLayer}>
                  <div className={styles.IBTText2}>
                    <div className={styles.IBTText2Font}>자납액</div>
                  </div>
                  <Inputbox_L
                    type="text"
                    placeholder="자납"
                    name="selfprice"
                    onChange={onChange}
                    register={register("selfprice")}
                    defaultValue={selfprice}
                  />
                </div>

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

                <div className={styles.IBBottonLayer}>
                  <Button_N>
                    <div className={styles.BottonFont2}>취소</div>
                  </Button_N>
                  <Button_Y>
                    <div className={styles.BottonFont}>확인</div>
                  </Button_Y>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
      ;
    </>
  );
}
export default withAuth(Inputmoneyloan);
