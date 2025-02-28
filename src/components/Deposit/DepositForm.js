"use client";

import { Inputbox } from "@/components/Inputbox";
import styles from "@/styles/Deposit.module.scss";
import { FaPrint } from "react-icons/fa6"; // 아이콘 추가
import { useCallback } from "react";


const DepositForm = ({
  contractor,
  setContractor,
  memberNumber,
  setMemberNumber,

}) => {
  const onContractorChange = (e) => {
    const text = e.target.value;
    setContractor(text.trim());
  };

  const onMemberNumberChange = (e) => {
    const text = e.target.value;
    setMemberNumber(text.trim());
  };

  return (
    <>
    <p></p>
    <div className={styles.flexContainer}>
      <p></p>
      {/* 회원번호 검색 Inputbox */}
      <Inputbox
        type="text"
        placeholder="관리번호"
        value={memberNumber}
        onChange={onMemberNumberChange}
      />
      {/* 회원성함 검색 Inputbox */}
      <Inputbox
        type="text"
        placeholder="회원 성함"
        value={contractor}
        onChange={onContractorChange}
      />
      {/* 엑셀 출력 버튼 */}
      
      
    </div>
    </>
  );
};

export default DepositForm;
