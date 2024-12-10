// pages/latefees/page.js
"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import withAuth from "@/utils/hoc/withAuth";
import LateFeeList from "@/components/LateFeeList";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import styles from "@/styles/Search.module.scss"; // 스타일 임포트
import categoryMapping from "@/utils/categoryMapping";
import { FaPrint } from "react-icons/fa6"; // FaPrint 아이콘 임포트

function LateFees() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [lateFees, setLateFees] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 엑셀 내보내기 핸들러
  const handleExport = () => {
    if (lateFees.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    // 정렬된 데이터를 기준으로 엑셀 생성
    const sortedData = [...lateFees];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // null 또는 undefined 처리
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // 엑셀에 넣을 데이터 포맷팅
    const exportData = sortedData.map((fee) => ({
      ID: fee.id,
      "마지막 미납 차수": fee.lastUnpaidPhaseNumber || "없음",
      분류: categoryMapping[fee.customertype] || "N/A",
      성명: fee.name || "N/A",
      가입일: fee.registerdate ? fee.registerdate.slice(0, 10) : "N/A",
      연체기준일: fee.lateBaseDate ? fee.lateBaseDate.slice(0, 10) : "N/A",
      최근납부: fee.recentPaymentDate
        ? fee.recentPaymentDate.slice(0, 10)
        : "N/A",
      일수: fee.daysOverdue,
      "연체율 (%)": fee.lateRate.toFixed(2),
      연체금액: fee.overdueAmount,
      납입금액: fee.paidAmount,
      연체료: fee.lateFee,
      "내야할 돈 합계": fee.totalOwed,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LateFees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // 현재 날짜를 "YYYYMMDD" 형식으로 포맷팅
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;

    saveAs(data, `LateFees_${formattedDate}.xlsx`);
  };

  return (
    <>
      <div className={styles.headerContainer}>
        <h3>연체료 조회</h3>
        <div className={styles.exportContainer}>
          <FaPrint
            onClick={handleExport}
            className={styles.printIcon}
            title="엑셀로 출력"
          />
          <button onClick={handleExport} className={styles.exportButton}>
            엑셀로 출력
          </button>
        </div>
      </div>
      <SearchForm
        name={name}
        setName={setName}
        number={number}
        setNumber={setNumber}
      />
      <LateFeeList
        name={name}
        number={number}
        linkBase="/latefees/"
        setLateFees={setLateFees}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />
    </>
  );
}

export default withAuth(LateFees);
