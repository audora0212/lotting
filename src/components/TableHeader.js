// components/TableHeader.js
"use client";

import styles from "@/styles/Search.module.scss";

const TableHeader = ({ headers, onSort }) => {
  return (
    <div className={styles.tablecontainer}>
      {headers.map((header) => (
        <div className={styles.unitContainer} key={header.key}>
          <span onClick={() => onSort(header.key)}>{header.label}</span>
        </div>
      ))}
    </div>
  );
};

export default TableHeader;
