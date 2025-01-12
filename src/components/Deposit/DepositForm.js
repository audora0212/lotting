// components/DepositForm.js
"use client";

import { Inputbox } from "@/components/Inputbox";
import depositStyles from "@/styles/Deposit.module.scss";

/**
 * 입금 내역 페이지에서 검색할 때 사용할 폼:
 * - contractor (계약자 이름)
 * - memberNumber (회원번호)
 */
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
    <div className={depositStyles.flexContainer}>
      <Inputbox
        type="text"
        placeholder="관리번호"
        value={memberNumber}
        onChange={onMemberNumberChange}
      />
      <Inputbox
        type="text"
        placeholder="회원 성함"
        value={contractor}
        onChange={onContractorChange}
      />
    </div>
  );
};

export default DepositForm;
