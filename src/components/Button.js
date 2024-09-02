"use client"
import styles from "@/styles/Button.module.scss"
import { useState } from 'react'

import { CgSearch } from "react-icons/cg";
import { FaFileDownload } from "react-icons/fa";

import { downloadFile } from "@/utils/api";

export const Button = (props) => {
    return(
        <button className={styles.buttonstyle}>
            {props.children}
        </button>
    )
}

const iconstyle = { fontSize: "1.5em", marginLeft: "10px", marginTop: "10px" };

export const DownloadButton = (props) => {
    const userid = props.userid;
    const filename = props.filename;

    const handleClick = () => {
        downloadFile(userid,filename);
    }
    return(
        <>
        <p>{props.children}</p>
        <button className={styles.downloadbuttonstyle} onClick={handleClick}>
            다운로드
        </button>
        </>
    )
} 

export const CgSearchButton = (props) => {
    return(
        <button className={styles.CgButton}>
            <CgSearch />
            {props.children}
        </button>
    )
}

export const CheckButton = (props) => {
    const {name, value} = props;
    return(
        <input type="checkbox" className={styles.checkstyle} name={name} value={value} />
    )
}

export const Button_Y = (props) => {
    return(
        <button className={styles.buttonstyle_y}>
            {props.children}
        </button>
    )
}

export const Button_N = (props) => {
    return(
        <button className={styles.buttonstyle_n}>
            {props.children}
        </button>
    )
}

export const SearchButton = (props) => {
    return(
        <button className={styles.searchbuttonstyle}>
            {props.children}
        </button>
    )
}

export const ModifyButton = (props) => {
    return(
        <button className={styles.modifybutton} onClick={props.onClick}>
            {props.children}
        </button>
    )
}

export const ChecButton = (props) => {
    return(
        <button className={styles.checkbutton}>
            {props.children}
        </button>
    )
}

export const PaymentScheduleButton = (props) => {
    const [isActivePayment, setIsActivePayment] = useState(props.isclear); // 납입 버튼 활성화 상태를 관리하는 상태
    const setValue = props.setValue;
    const handlePaymentClick = () => {
        setIsActivePayment(true); // 납입 버튼 활성화
        setValue('isclear',true);
    };

    const handleScheduleClick = () => {
        setIsActivePayment(false); // 예정 버튼 활성화
        setValue('isclear',false);
    };

    return (
        <>
            <button type="button" className={`${styles.toggleButton} ${isActivePayment ? styles.active : ''}`} onClick={handlePaymentClick}>
                <div className={styles.ButtonFont}>납입</div>
            </button>
            <button  type="button" className={`${styles.toggleButton} ${!isActivePayment ? styles.active : ''}`} onClick={handleScheduleClick}>
                <div className={styles.ButtonFont2}>예정</div>
            </button>
        </>
    );
};