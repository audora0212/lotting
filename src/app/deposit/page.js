"use client";

import { useState, useEffect } from "react";
import DepositForm from "@/components/Deposit/DepositForm";
import withAuth from "@/utils/hoc/withAuth";
import DepositList from "@/components/Deposit/DepositList";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import depositStyles from "@/styles/Deposit.module.scss"; // 새로운 스타일 파일
import { FaPrint } from "react-icons/fa6"; // 아이콘

// 백엔드 API에서 입금내역 목록을 불러오는 함수 임포트 (전체 입금내역 DTO)
import { fetchDepositList } from "@/utils/api";

function DepositPage() {
  // 검색 필드: 'contractor'(계약자 이름)와 'memberNumber'(회원번호 → 여기서는 id 필터로 사용)
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
        let aValue, bValue;
        if (sortConfig.key === "computedDate") {
          aValue = a.loanRecord
            ? a.loanDetails?.loandate
              ? new Date(a.loanDetails.loandate)
              : new Date(0)
            : a.selfRecord && !isNaN(Number(a.selfRecord)) && a.loanDetails?.selfdate
            ? new Date(a.loanDetails.selfdate)
            : new Date(0);
          bValue = b.loanRecord
            ? b.loanDetails?.loandate
              ? new Date(b.loanDetails.loandate)
              : new Date(0)
            : b.selfRecord && !isNaN(Number(b.selfRecord)) && b.loanDetails?.selfdate
            ? new Date(b.loanDetails.selfdate)
            : new Date(0);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];

          if (aValue === null || aValue === undefined) return 1;
          if (bValue === null || bValue === undefined) return -1;

          if (sortConfig.key === "transactionDateTime") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }

          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
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
    const exportData = sortedData.map((item) => {
      let dateValue = "N/A";
      if (item.loanRecord) {
        dateValue = item.loanDetails?.loandate
          ? new Date(item.loanDetails.loandate).toLocaleDateString()
          : "N/A";
      } else if (item.selfRecord && !isNaN(Number(item.selfRecord))) {
        dateValue = item.loanDetails?.selfdate
          ? new Date(item.loanDetails.selfdate).toLocaleDateString()
          : "N/A";
      }
      return {
        "ID": item.id || "N/A",
        "거래일시": item.transactionDateTime
          ? new Date(item.transactionDateTime).toLocaleString()
          : "N/A",
        "적요": item.description || "",
        "기재내용": item.details || "",
        "계약자": item.contractor || "N/A",
        "찾으신금액": item.withdrawnAmount
          ? item.withdrawnAmount.toLocaleString()
          : "0",
        "맡기신금액": item.depositAmount
          ? item.depositAmount.toLocaleString()
          : "0",
        "거래 후 잔액": item.balanceAfter
          ? item.balanceAfter.toLocaleString()
          : "0",
        "취급점": item.branch || "",
        "계좌": item.account || "",
        "1차": item.depositPhase1 || "",
        "2차": item.depositPhase2 || "",
        "3차": item.depositPhase3 || "",
        "4차": item.depositPhase4 || "",
        "5차": item.depositPhase5 || "",
        "6차": item.depositPhase6 || "",
        "7차": item.depositPhase7 || "",
        "8차": item.depositPhase8 || "",
        "9차": item.depositPhase9 || "",
        "10차": item.depositPhase10 || "",
        "loan_record": item.loanRecord || "",
        "self_record": item.selfRecord || "",
        "일자": dateValue,
        "비고": item.remarks || "",
      };
    });

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
        const data = await fetchDepositList();
        setDepositData(data);
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
