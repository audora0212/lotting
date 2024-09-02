"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { AiOutlineBell } from "react-icons/ai";
import styles from "../styles/Header.module.scss";
import AuthContext from "@/utils/context/AuthContext";

const iconstyle = { fontSize: "1.5em", float: "left", margin: "13px" };

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const headertitle = {
    dashboard: "조합원관리시스템이 정상 작동중입니다 👋🏻",
    search: "회원 정보 검색",
    create: "회원 정보 입력",
    createwithdraw: "해약 회원 정보 입력",
    modify: "회원 정보 수정",
    inputmoney: "납입금 관리",
    control: "차수 관리",
  };
  const subtitle = {
    dashboard: "덕소 리버 베르데포레 [개발중]",
    search: "회원정보를 한번에 확인할 수 있는 페이지입니다.",
    create: "신규 회원정보를 생성할 수 있는 페이지입니다.",
    createwithdraw: "해약 회원정보를 생성할 수 있는 페이지입니다.",
    modify: "기존 회원정보를 수정할 수 있는 페이지입니다.",
    inputmoney: "회원의 납입금을 한번에 관리할 수 있는 페이지입니다.",
    control:
      "차수별 납입금을 한번에 확인하고 수정,생성,삭제를 진행할 수 있습니다. [개발중]",
  };

  const { isLoggedIn, username, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.maincontainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>{headertitle[splitpath[1]]}</h1>
        <h3 className={styles.subtitle}>{subtitle[splitpath[1]]}</h3>
      </div>
      <div className={styles.rightcontainer}>
        <AiOutlineBell style={iconstyle} />
        <div className={styles.loginbody}>
          {isLoggedIn ? (
            <div className={styles.usercontainer}>
              <div className={styles.Name}>
                <h1 className={styles.name}>{username}</h1>
              </div>
              <div className={styles.loginfo}>
                <h3 className={styles.role}>Logged in</h3>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <h3 className={styles.role}>
                    <div className={styles.logoutbutton}>로그아웃</div>
                  </h3>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.button}>
              <button onClick={handleLogin} className={styles.loginButton}>
                <div className={styles.ButtonFont}>로그인</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
