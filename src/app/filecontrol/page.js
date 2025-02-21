"use client";

import { useState } from "react";
import styles from "@/styles/Create.module.scss";
import withAuth from "@/utils/hoc/withAuth";
import { ExcelFileInputbox } from "@/components/Inputbox";
import {
  uploadExcelFileWithProgress,          // 고객 파일 업로드용 API
  uploadDepositHistoryExcelWithProgress, // 입금내역 업로드용 API
  downloadRegFile,                       // Reg 파일 다운로드용 API
} from "@/utils/api";

function FilecontrolPage() {
  // 1) 고객 파일 업로드 관련 state
  const [customerFile, setCustomerFile] = useState(null);
  const [customerProgress, setCustomerProgress] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");

  // 2) 입금 기록(Deposit) 업로드 관련 state
  const [depositFile, setDepositFile] = useState(null);
  const [depositProgress, setDepositProgress] = useState("");
  const [depositMessage, setDepositMessage] = useState("");

  // 3) Reg 파일 다운로드 관련 state
  const [regProgress, setRegProgress] = useState("");
  const [regMessage, setRegMessage] = useState("");

  // ─────────────────────────────
  // (A) 고객 파일 업로드 핸들러
  // ─────────────────────────────
  const handleCustomerFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setCustomerFile(files[0]);
    }
  };

  const handleCustomerUpload = async () => {
    if (!customerFile) {
      setCustomerMessage("고객 파일을 선택해주세요.");
      return;
    }
    // 초기화
    setCustomerMessage("고객 파일 업로드 시작...");
    setCustomerProgress("");

    try {
      await uploadExcelFileWithProgress(
        customerFile,
        (prog) => {
          // progress 콜백
          setCustomerProgress(prog); // 예: "3/30"
        },
        (msg) => {
          // complete 콜백
          setCustomerMessage("고객 파일 업로드 완료: " + msg);
        },
        (err) => {
          // error 콜백
          setCustomerMessage("고객 파일 업로드 실패: " + err);
        }
      );
    } catch (error) {
      console.error("고객 파일 업로드 오류:", error);
      setCustomerMessage("업로드 중 오류 발생: " + error.message);
    }
  };

  // ─────────────────────────────
  // (B) 입금 기록(Deposit) 업로드 핸들러
  // ─────────────────────────────
  const handleDepositFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setDepositFile(files[0]);
    }
  };

  const handleDepositUpload = async () => {
    if (!depositFile) {
      setDepositMessage("입금내역 파일을 선택해주세요.");
      return;
    }
    setDepositMessage("입금내역 업로드 시작...");
    setDepositProgress("");

    try {
      await uploadDepositHistoryExcelWithProgress(
        depositFile,
        (prog) => {
          setDepositProgress(prog);
        },
        (msg) => {
          setDepositMessage("입금내역 업로드 완료: " + msg);
        },
        (err) => {
          setDepositMessage("입금내역 업로드 실패: " + err);
        }
      );
    } catch (error) {
      console.error("입금내역 업로드 오류:", error);
      setDepositMessage("업로드 중 오류 발생: " + error.message);
    }
  };

  // ─────────────────────────────
  // (C) Reg 파일 다운로드 핸들러
  // ─────────────────────────────
  const handleRegFileDownload = async () => {
    setRegMessage("Reg 파일 다운로드 시작...");
    setRegProgress("");
    try {
      await downloadRegFile(
        (prog) => {
          setRegProgress(prog);
        },
        (fileName) => {
          setRegMessage("다운로드 완료: " + fileName);
        },
        (err) => {
          setRegMessage("다운로드 실패: " + err);
        }
      );
    } catch (error) {
      console.error("Reg 파일 다운로드 실패:", error);
      setRegMessage("다운로드 중 오류 발생: " + error.message);
    }
  };

  return (
    <div className={styles.content_container}>

      {/* ─────────────────────────────
          1) 고객 파일 업로드 섹션
          ───────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>고객 파일 업로드 (엑셀, SSE 진행도)</h3>
        <ExcelFileInputbox
          name="customerFileUpload"
          handleChange={handleCustomerFileChange}
          value={customerFile ? customerFile.name : ""}
          isupload={!!customerFile}
        />
        <button onClick={handleCustomerUpload}>고객 파일 업로드</button>
        {/* 메시지 & 진행도 */}
        {customerMessage && <p>{customerMessage}</p>}
        {customerProgress && <p>진행도: {customerProgress}</p>}
      </div>

      {/* ─────────────────────────────
          2) Reg 파일 다운로드 섹션
          ───────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Reg 파일 다운로드</h3>
        <button onClick={handleRegFileDownload}>다운로드 버튼</button>
        {regMessage && <p>{regMessage}</p>}
        {regProgress && <p>진행도: {regProgress}</p>}
      </div>

      {/* ─────────────────────────────
          3) 입금내역(Deposit) 업로드 섹션
          ───────────────────────────── */}
      <div>
        <h3>입금내역 업로드 (엑셀, SSE 진행도)</h3>
        <ExcelFileInputbox
          name="depositFileUpload"
          handleChange={handleDepositFileChange}
          value={depositFile ? depositFile.name : ""}
          isupload={!!depositFile}
        />
        <button onClick={handleDepositUpload}>입금내역 업로드</button>
        {depositMessage && <p>{depositMessage}</p>}
        {depositProgress && <p>진행도: {depositProgress}</p>}
      </div>
    </div>
  );
}

export default withAuth(FilecontrolPage);
