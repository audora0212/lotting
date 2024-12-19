"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useMemo } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// 숫자 천단위 콤마 처리 함수
function formatNumberWithComma(num) {
  if (num == null || isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function OverduePage() {
  const params = useParams();
  const phasenumber = params.phasenumber;
  const searchParams = useSearchParams();

  const overdueAmount = searchParams.get("amount")
    ? parseFloat(searchParams.get("amount"))
    : 0;
  const userid = searchParams.get("userid") || "정보 없음";
  const name = searchParams.get("name") || "정보 없음";

  // 연체율 8%
  const lateRate = 0.08;
  const today = new Date();

  // 30일부터 1일까지 내림차순 날짜 리스트 생성
  const daysArray = Array.from({ length: 30 }, (_, i) => 30 - i); 
  // daysArray = [30, 29, 28, ..., 1]

  const data = useMemo(() => {
    let previousOverdueFee = overdueAmount * lateRate; // 첫 날(30일 후) 연체료
    const result = [];
    // 첫 날(가장 먼 날짜): overdueFee = overdueAmount * lateRate
    // 둘째 날부터: overdueFee = previousOverdueFee * (1 + lateRate)
    for (let i = 0; i < daysArray.length; i++) {
      const day = daysArray[i];
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      let overdueFee;
      if (i === 0) {
        // 첫 날
        overdueFee = previousOverdueFee;
      } else {
        // 두 번째 날부터 전날 연체료 * (1 + lateRate)
        overdueFee = previousOverdueFee * (1 + lateRate);
        previousOverdueFee = overdueFee; // 다음날 계산을 위해 업데이트
      }

      // 납부금액 = 연체금액 + 당일 연체료
      const totalPayment = overdueAmount + overdueFee;

      result.push({
        날짜: date.toISOString().slice(0, 10),
        일수: `${day}일`,
        연체율: `${(lateRate * 100).toFixed(2)}%`,
        연체료: Math.round(overdueFee),
        납부금액: Math.round(totalPayment),
      });
    }

    return result;
  }, [overdueAmount, lateRate, today]);

  // 엑셀 내보내기 핸들러
  const handleExport = () => {
    if (data.length === 0) {
      alert("내보낼 데이터가 없습니다.");
      return;
    }

    // 엑셀에 넣을 데이터 포맷팅
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OverdueFees");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // 현재 날짜를 "YYYYMMDD" 형식으로 포맷팅
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;

    saveAs(blob, `Overdue_${userid}_${phasenumber}_${formattedDate}.xlsx`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={headerContainerStyle}>
        <h1>일자별 연체료 ({phasenumber}차)</h1>
        <button
          style={exportButtonStyle}
          onClick={handleExport}
          title="엑셀로 출력"
        >
          엑셀로 출력
        </button>
      </div>
      <p>관리번호: {userid}</p>
      <p>이름: {name}</p>
      <p>연체금액: {formatNumberWithComma(overdueAmount)}원</p>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>날짜</th>
            <th style={thStyle}>일수</th>
            <th style={thStyle}>연체율</th>
            <th style={thStyle}>연체료</th>
            <th style={thStyle}>납부금액</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={tdStyle}>{row.날짜}</td>
              <td style={tdStyle}>{row.일수}</td>
              <td style={tdStyle}>{row.연체율}</td>
              <td style={tdStyle}>{formatNumberWithComma(row.연체료)}원</td>
              <td style={tdStyle}>{formatNumberWithComma(row.납부금액)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 스타일 객체
const headerContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const exportButtonStyle = {
  backgroundColor: "#5c9ef5",
  borderRadius: "4px",
  padding: "8px 12px",
  cursor: "pointer",
  color: "#fff",
  border: "none",
};

const thStyle = {
  border: "1px solid #ccc",
  background: "#f2f2f2",
  padding: "8px",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};
