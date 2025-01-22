"use client";

import { Inputbox } from "@/components/Inputbox";
import depositStyles from "@/styles/Deposit.module.scss";
import { FaPrint } from "react-icons/fa6"; // 아이콘 추가
import { useCallback } from "react";


const DepositForm = ({
  contractor,
  setContractor,
  memberNumber,
  setMemberNumber,
  onExport, // 엑셀 출력 버튼 핸들러를 상위 컴포넌트에서 전달받음
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
    <div className={depositStyles.flexContainer}>
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
      <div className={depositStyles.exportContainer}>
        <FaPrint
          onClick={onExport}
          style={{color:"#5c41c2",fontSize: "14px" }}
          className={depositStyles.printIcon}
          title="엑셀로 출력"
        />
        <button
          onClick={onExport}
          className={depositStyles.exportButton}
        >
          엑셀로 출력
        </button>
      </div>
      
    </div>
  );
};

export default DepositForm;
