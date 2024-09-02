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
        <div
          className={styles.expandableContainer}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
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
          <div className={styles.expandableMenu}>
            <Link href="/search">
              <div className={styles.expandableMenuItem}>정계약</div>
            </Link>
            <Link href="/search/modify">
              <div className={styles.expandableMenuItem}>수정</div>
            </Link>
            <Link href="/search/cancel">
              <div className={styles.expandableMenuItem}>해지</div>
            </Link>
          </div>
        </div>
        <Link href="/create">
          <div
            className={
              splitpath[1] === "create" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "create" ? (
                <HiUsers style={iconstyle} />
              ) : (
                <HiOutlineUsers style={iconstyle} />
              )}
              <span className={styles.innertext}>회원 정보 입력</span>
            </div>
          </div>
        </Link>
        <Link href="/createwithdraw">
          <div
            className={
              splitpath[1] === "createwithdraw"
                ? styles.select
                : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "createwithdraw" ? (
                <HiUsers style={iconstyle} />
              ) : (
                <HiOutlineUsers style={iconstyle} />
              )}
              <span className={styles.innertext}>해약 회원 입력</span>
            </div>
          </div>
        </Link>
        <div
          className={styles.expandableContainer}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <div
            className={
              splitpath[1] === "modify" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "modify" ? (
                <HiUsers style={iconstyle} />
              ) : (
                <HiOutlineUsers style={iconstyle} />
              )}
              <span className={styles.innertext}>회원 정보 수정</span>
            </div>
          </div>
          <div className={styles.expandableMenu}>
            <Link href="/modify">
              <div className={styles.expandableMenuItem}>정계약</div>
            </Link>
            <Link href="/modify/modify">
              <div className={styles.expandableMenuItem}>수정</div>
            </Link>
            <Link href="/modify/cancel">
              <div className={styles.expandableMenuItem}>해지</div>
            </Link>
          </div>
        </div>

        <Link href="/inputmoney">
          <div
            className={
              splitpath[1] === "inputmoney" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "inputmoney" ? (
                <AiFillDollarCircle style={iconstyle} />
              ) : (
                <AiOutlineDollar style={iconstyle} />
              )}
              <span className={styles.innertext}>납입금 관리</span>
            </div>
          </div>
        </Link>
        <Link href="/control">
          <div
            className={
              splitpath[1] === "control" ? styles.select : styles.nonselect
            }
          >
            <div className={styles.innerContainer}>
              {splitpath[1] === "control" ? (
                <AiFillDollarCircle style={iconstyle} />
              ) : (
                <AiOutlineDollar style={iconstyle} />
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
