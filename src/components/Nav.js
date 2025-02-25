"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AiFillAppstore,
  AiOutlineAppstore,
  AiOutlineDollar,
  AiFillDollarCircle,
} from "react-icons/ai";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { HiUserAdd } from "react-icons/hi";
import { GrMoney } from "react-icons/gr";
import { MdOutlineAccountBalance, MdAccountBalance, MdManageAccounts,MdOutlineManageAccounts  } from "react-icons/md"; //<MdOutlineAccountBalance />  <MdAccountBalance />
import { RiMoneyDollarCircleFill, RiMoneyDollarCircleLine } from "react-icons/ri"; //<RiMoneyDollarCircleFill />  <RiMoneyDollarCircleLine />
import { IoCloudUploadOutline,IoCloudUpload  } from "react-icons/io5";

import LOGO from "@/img/logo.png";
import styles from "../styles/Nav.module.scss";

const iconstyle = { fontSize: "1.5em", paddingRight: "10%", paddingLeft: "7%" };

const Nav = () => {
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Link href="/dashboard">
        <Image src={LOGO} className={styles.logostyle} alt={"logo"} />
      </Link>
      <div className={styles.listContainer}>
        {/* Dashboard Link */}
        <Link href="/dashboard">
          <div
            className={
              splitpath[1] === "dashboard" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "dashboard" ? (
                <AiFillAppstore style={iconstyle} />
              ) : (
                <AiOutlineAppstore style={iconstyle} />
              )}
              <span className={styles.innertext}>대시보드</span>
            </div>
          </div>
        </Link>

        {/* 회원 정보 검색 Link (Simplified) */}
        <Link href="/search">
          <div
            className={
              splitpath[1] === "search" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "search" ? (
                <HiUsers style={iconstyle} />
              ) : (
                <HiOutlineUsers style={iconstyle} />
              )}
              <span className={styles.innertext}>회원 정보 검색</span>
            </div>
          </div>
        </Link>

        {/* 회원 정보 입력 Link */}
        <Link href="/create">
          <div
            className={
              splitpath[1] === "create" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "create" ? (
                <HiUserAdd  style={iconstyle} />
              ) : (
                <HiUserAdd  style={iconstyle} />
              )}
              <span className={styles.innertext}>회원 정보 입력</span>
            </div>
          </div>
        </Link>
        <Link href="/deposit">
          <div
            className={
              splitpath[1] === "deposit" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "deposit" ? (
                <RiMoneyDollarCircleFill style={iconstyle} />
              ) : (
                <RiMoneyDollarCircleLine style={iconstyle} />
              )}
              <span className={styles.innertext}>전체 입출금 내역</span>
            </div>
          </div>
        </Link>

        <Link href="/companydeposit">
          <div
            className={
              splitpath[2] === "companydeposit" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[2] === "companydeposit" ? (
                <MdAccountBalance style={iconstyle} />
              ) : (
                <MdOutlineAccountBalance style={iconstyle} />
              )}
              <span className={styles.innertext}>기업 입출금 추가</span>
            </div>
          </div>
        </Link>
        {/* 연체료 메뉴 Link */}
        <Link href="/latefees">
          <div
            className={
              splitpath[1] === "latefees" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "latefees" ? (
                <GrMoney style={iconstyle} />
              ) : (
                <GrMoney style={iconstyle} />
              )}
              <span className={styles.innertext}>연체료 (임시)</span>
            </div>
          </div>
        </Link>
        {/* 연체료 메뉴 Link */}
        <Link href="/filecontrol">
          <div
            className={
              splitpath[1] === "filecontrol" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "filecontrol" ? (
                <IoCloudUpload style={iconstyle} />
              ) : (
                <IoCloudUploadOutline style={iconstyle} />
              )}
              <span className={styles.innertext}>엑셀파일</span>
            </div>
          </div>
        </Link>
        {/* 차수 관리 Link */}
        <Link href="/control">
          <div
            className={
              splitpath[1] === "control" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "control" ? (
                <MdManageAccounts   style={iconstyle} />
              ) : (
                <MdOutlineManageAccounts  style={iconstyle} />
              )}
              <span className={styles.innertext}>차수 관리</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Nav;
