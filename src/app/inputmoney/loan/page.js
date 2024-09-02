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
import { useState } from "react";
import withAuth from "@/utils/hoc/withAuth";

const Inputmoneyloan = () => {
  const { register, watch, handleSubmit } = useForm();

  return (
    <div className={styles.Container}>
      <div className={styles.Mainbody}>
        <div className={styles.MainTitle}>
          <div className={styles.MainTitle1}>
            <div className={styles.SearchClientNum}>
              <div className={styles.SearchFont1}>회원번호 : </div>
              <div className={styles.SearchFont2}>123456</div>
            </div>
          </div>
          <div className={styles.MainTitle2}>
            <Link href="/inputmoney">
              <SearchButton>
                <div className={styles.BottonIcon} style={{ color: "white" }}>
                  <CgSearch style={{ width: "100%", height: "100%" }} />
                </div>
                <div className={styles.BottonFont}>회원선택</div>
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
            <Inputbox_L
              type="date"
              date_placeholder="대출일"
              register={register("loandate")}
            />
          </div>
          <div className={styles.IBLayer}>
            <div className={styles.IBTText2}>
              <div className={styles.IBTText2Font}>농협</div>
            </div>
            <Inputbox_L
              type="text"
              placeholder="대출금"
              register={register("N_loanomey")}
            />
          </div>
          {/* 한 덩어리 */}

          <div className={styles.IBLayer}>
            <div className={styles.IBTText2}>
              <div className={styles.IBTText2Font}>새마을</div>
            </div>
            <Inputbox_L
              type="text"
              placeholder="대출금"
              register={register("S_loanmoney")}
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
            <Inputbox_L
              type="date"
              date_placeholder="자납일"
              register={register("selfpaydate")}
            />
          </div>
          {/* 한 덩어리 */}

          <div className={styles.IBLayer}>
            <Inputbox_L
              type="text"
              placeholder="자납"
              register={register("selfpayment")}
            />
          </div>
          {/* 한 덩어리 */}

          {/* 한 덩어리 */}
          <div className={styles.IBLayer}>
            <Inputbox_L
              type="text"
              placeholder="면제액"
              register={register("exemptionmoney")}
            />
          </div>
          {/* 한 덩어리 */}

          <div className={styles.InputBodyTitle}>
            <div className={styles.IBTIcon}>
              <div className={styles.Icon} style={{ color: "#7152F3" }}>
                <BsDatabase style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
            <div className={styles.IBTText}>총액</div>
          </div>

          <div className={styles.IBLayer}>
            <Inputbox_L
              type="text"
              placeholder="총액"
              register={register("totalmoney")}
            />
          </div>
          {/* 한 덩어리 */}

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
    </div>
  );
};

export default withAuth(Inputmoneyloan);
