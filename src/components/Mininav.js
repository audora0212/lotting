"use client";

import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";

import Link from "next/link";
import React from 'react'
import { usePathname } from "next/navigation";

import styles from "../styles/Mininav.module.scss";

const iconstyle = { fontSize: "1.2em", paddingRight: "2%", paddingLeft: "1%" };

const Mininav = () => {
    const pathname = usePathname();
    const splitpath = pathname.split('/');
  
    return(
        <ul className={styles.listconatiner}>
            <Link href={"/search/userinfo/"+splitpath[3]}>
                <li className={splitpath[2] === "userinfo" ? styles.select : styles.nonselect}> 
                        {splitpath[2] === "userinfo" ? (<FaUser style={iconstyle} />) : (<FaRegUser style={iconstyle} />)}
                        <span>고객 정보</span>
                </li>
            </Link>
            <Link href={"/search/payinfo/"+splitpath[3]}>
                <li className={splitpath[2] === "payinfo" ? styles.select : styles.nonselect}> 
                        {splitpath[2] === "payinfo" ? (<MdBusinessCenter style={iconstyle} />) : (<MdOutlineBusinessCenter style={iconstyle} />)}
                        <span>납입금</span>
                </li>
            </Link>
            <Link href={"/search/leaninfo/"+splitpath[3]}>
                <li className={splitpath[2] === "leaninfo" ? styles.select : styles.nonselect}> 
                        {splitpath[2] === "leaninfo" ? (<RiMoneyDollarCircleFill style={iconstyle} />) : (<RiMoneyDollarCircleLine style={iconstyle} />)}
                        <span>대출/자납</span>
                </li>
            </Link>
            <Link href={"/search/extinfo/"+splitpath[3]}>
                <li className={splitpath[2] === "extinfo" ? styles.select : styles.nonselect}> 
                        {splitpath[2] === "extinfo" ? (<IoDocumentText style={iconstyle} />) : (<IoDocumentTextOutline style={iconstyle} />)}
                        <span>비고</span>
                </li>
            </Link>
        </ul>
    );
}



export default Mininav;