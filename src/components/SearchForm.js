// components/SearchForm.js
"use client";

import { Inputbox, DropInputbox } from "@/components/Inputbox";
import styles from "@/styles/Search.module.scss";

const SearchForm = ({ name, setName, number, setNumber, dropdownLists }) => {
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
      {/* 드롭다운 리스트를 활용하여 필터 기능을 추가할 수 있습니다 */}
    </div>
  );
};

export default SearchForm;
