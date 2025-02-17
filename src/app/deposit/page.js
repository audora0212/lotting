// pages/deposit/page.js
"use client";

import { useState, useEffect } from "react";
import DepositForm from "@/components/Deposit/DepositForm";
import withAuth from "@/utils/hoc/withAuth";
import DepositList from "@/components/Deposit/DepositList";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import depositStyles from "@/styles/Deposit.module.scss"; // 새로운 스타일 파일
import { FaPrint } from "react-icons/fa6"; // 아이콘

// api.js에서 제공하는 함수 임포트
//import { fetchDepositData } from "@/utils/api";

function DepositPage() {
  // 검색 필드: 'contractor'(계약자 이름)와 'memberNumber'(회원번호)
  const [contractor, setContractor] = useState("");
  const [memberNumber, setMemberNumber] = useState("");
  const [depositData, setDepositData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 엑셀 내보내기 핸들러
  const handleExport = () => {
    if (depositData.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    // 정렬된 데이터를 기준으로 엑셀 생성
    const sortedData = [...depositData];
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
    const exportData = sortedData.map((item) => ({
      회원번호: item.memberNumber || "N/A",
      "마지막 거래 일시": item.lastTransactionDateTime
        ? new Date(item.lastTransactionDateTime).toLocaleDateString()
        : "N/A",
      적요: item.remarks || "",
      기재내용: item.memo || "",
      계약자: item.contractor || "N/A",
      "찾으신 금액 (환불)": item.withdrawnAmount
        ? item.withdrawnAmount.toLocaleString()
        : "0",
      "맡기신 금액 (입금 총액)": item.depositAmount
        ? item.depositAmount.toLocaleString()
        : "0",
      취급점: item.bankBranch || "",
      계좌: item.account || "",
      예약: item.reservation || "",
      "1차 입금": item.depositPhase1 || "",
      "2차 입금": item.depositPhase2 || "",
      "3차 입금": item.depositPhase3 || "",
      "4차 입금": item.depositPhase4 || "",
      "5차 입금": item.depositPhase5 || "",
      "6차 입금": item.depositPhase6 || "",
      "7차 입금": item.depositPhase7 || "",
      "8차 입금": item.depositPhase8 || "",
      "9차 입금": item.depositPhase9 || "",
      "10차 입금": item.depositPhase10 || "",
      대출금액: item.loanAmount ? item.loanAmount.toLocaleString() : "0",
      대출일자: item.loanDate
        ? new Date(item.loanDate).toLocaleDateString()
        : "N/A",
      임시: item.temporary || "",
      비고: item.note || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Deposit");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // 현재 날짜를 "YYYYMMDD" 형식으로 포맷팅
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;

    saveAs(data, `Deposit_${formattedDate}.xlsx`);
  };

  // 데이터 페칭
  useEffect(() => {
    const getData = async () => {
      try {
        //const data = await fetchDepositData();
        //setDepositData(data);
      } catch (error) {
        console.error("입금 내역을 불러오는 데 실패했습니다.", error);
      }
    };
    getData();
  }, []);

  return (
    <>


      <DepositForm
  contractor={contractor}
  setContractor={setContractor}
  memberNumber={memberNumber}
  setMemberNumber={setMemberNumber}
  onExport={handleExport} // 엑셀 출력 버튼 핸들러 전달
/>

      <DepositList
        contractor={contractor}
        memberNumber={memberNumber}
        setDepositData={setDepositData}
        sortConfig={sortConfig}
        setSortConfig={setSortConfig}
      />
    </>
  );
}

export default withAuth(DepositPage);
