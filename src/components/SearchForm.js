// components/SearchForm.js
"use client";

import { Inputbox } from "@/components/Inputbox";
import styles from "@/styles/Latefees.module.scss";

const SearchForm = ({ name, setName, number, setNumber }) => {
  const onNameChange = (e) => {
    const text = e.target.value;
    setName(text.replace(/ /g, ""));
  };

  const onNumberChange = (e) => {
    const text = e.target.value;
    setNumber(text.replace(/ /g, ""));
  };

  return (
    <div className={styles.flexContainer}>
      <Inputbox
        type="text"
        placeholder="관리번호"
        value={number}
        onChange={onNumberChange}
      />
      <Inputbox
        type="text"
        placeholder="회원 성함"
        value={name}
        onChange={onNameChange}
      />
      {/* 필요하다면 다른 필터 드롭다운 등을 추가 */}
    </div>
  );
};

export default SearchForm;
