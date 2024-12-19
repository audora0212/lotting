"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useMemo } from "react";

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
    // 둘째 날부터: overdueFee = previousOverdueFee * lateRate
    for (let i = 0; i < daysArray.length; i++) {
      const day = daysArray[i];
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      let overdueFee;
      if (i === 0) {
        // 첫 날
        overdueFee = previousOverdueFee;
      } else {
        // 두 번째 날부터 전날 연체료 * lateRate
        overdueFee = previousOverdueFee * (1+lateRate);
        previousOverdueFee = overdueFee; // 다음날 계산을 위해 업데이트
      }

      // 납부금액 = 연체금액 + 당일 연체료
      const totalPayment = overdueAmount + overdueFee;

      result.push({
        date: date.toISOString().slice(0, 10),
        day,
        lateRate: (lateRate * 100).toFixed(2) + "%",
        overdueFee: Math.round(overdueFee),
        totalPayment: Math.round(totalPayment),
      });
    }

    return result;
  }, [overdueAmount, lateRate, today]);

  const handleExport = () => {
    // CSV 생성
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "날짜,일수,연체율,연체료,납부금액\n";
    data.forEach((row) => {
      csvContent += [
        row.date,
        row.day + "일",
        row.lateRate,
        row.overdueFee,
        row.totalPayment,
      ].join(",") + "\n";
    });

    const blob = new Blob([decodeURIComponent(encodeURIComponent(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Overdue_${userid}_${phasenumber}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>일자별 연체료 ({phasenumber}차)</h1>
      <p>관리번호: {userid}</p>
      <p>이름: {name}</p>
      <p>연체금액: {formatNumberWithComma(overdueAmount)}원</p>

      <button
        style={{
          backgroundColor: "#5c9ef5",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
          color: "#fff",
          border: "none",
          marginBottom: "20px",
        }}
        onClick={handleExport}
      >
        엑셀(CSV)로 내보내기
      </button>

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
              <td style={tdStyle}>{row.date}</td>
              <td style={tdStyle}>{row.day}일</td>
              <td style={tdStyle}>{row.lateRate}</td>
              <td style={tdStyle}>{formatNumberWithComma(row.overdueFee)}원</td>
              <td style={tdStyle}>{formatNumberWithComma(row.totalPayment)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
