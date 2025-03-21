// src/app/modify/[id]/page.js
"use client";

import { useState } from "react";
import styles from "@/styles/Userinfo.module.scss";
import withAuth from "@/utils/hoc/withAuth";
import { ExcelFileInputbox } from "@/components/Inputbox";
import { Button_Y } from "@/components/Button";
import { useRouter } from "next/navigation";
import {
  uploadExcelFileWithProgress,
  downloadRegFile,
  uploadDepositHistoryExcelWithProgress,
  downloadDepositHistoryExcel,
  uploadRefundFileWithProgress,
  downloadRefundFile,
} from "@/utils/api";

function FilecontrolPage() {
  const router = useRouter();

  // 고객 파일 업로드/다운로드 상태
  const [customerFile, setCustomerFile] = useState(null);
  const [customerProgress, setCustomerProgress] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");

  const [regProgress, setRegProgress] = useState("");
  const [regMessage, setRegMessage] = useState("");

  // 입금내역 파일 업로드/다운로드 상태
  const [depositFile, setDepositFile] = useState(null);
  const [depositProgress, setDepositProgress] = useState("");
  const [depositMessage, setDepositMessage] = useState("");

  const [depDownloadProgress, setDepDownloadProgress] = useState("");
  const [depDownloadMessage, setDepDownloadMessage] = useState("");

  // 환불 파일 업로드/다운로드 상태
  const [refundFile, setRefundFile] = useState(null);
  const [refundProgress, setRefundProgress] = useState("");
  const [refundMessage, setRefundMessage] = useState("");

  const [refundDownloadProgress, setRefundDownloadProgress] = useState("");
  const [refundDownloadMessage, setRefundDownloadMessage] = useState("");

  // 진행률 바 렌더링 헬퍼
  const renderProgressBar = (progress) => {
    if (!progress || !progress.includes('/')) return null;
    const [current, total] = progress.split('/').map(Number);
    if (isNaN(current) || isNaN(total)) return null;
    return (
      <progress
        value={current}
        max={total}
        style={{ width: "30%", marginTop: "0.5rem" }}
      />
    );
  };

  // ────────────── 고객 파일 업로드/다운로드 ──────────────
  const handleCustomerFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) setCustomerFile(files[0]);
  };

  const handleCustomerUpload = async () => {
    if (!customerFile) {
      setCustomerMessage("고객 파일을 선택해주세요.");
      return;
    }
    setCustomerMessage("고객 파일 업로드 시작...");
    setCustomerProgress("");
    try {
      await uploadExcelFileWithProgress(
        customerFile,
        (prog) => setCustomerProgress(prog),
        (msg) => setCustomerMessage("고객 파일 업로드 완료: " + msg),
        (err) => setCustomerMessage("고객 파일 업로드 실패: " + err)
      );
    } catch (error) {
      console.error("고객 파일 업로드 오류:", error);
      setCustomerMessage("업로드 중 오류 발생: " + error.message);
    }
  };

  const handleRegFileDownload = async () => {
    setRegMessage("고객 파일 다운로드 시작...");
    setRegProgress("");
    try {
      await downloadRegFile(
        (prog) => setRegProgress(prog),
        (fileName) => setRegMessage("다운로드 완료: " + fileName),
        (err) => setRegMessage("다운로드 실패: " + err)
      );
    } catch (error) {
      console.error("고객 파일 다운로드 실패:", error);
      setRegMessage("다운로드 중 오류 발생: " + error.message);
    }
  };

  // ────────────── 입금내역 파일 업로드/다운로드 ──────────────
  const handleDepositFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) setDepositFile(files[0]);
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
        (prog) => setDepositProgress(prog),
        (msg) => setDepositMessage("입금내역 업로드 완료: " + msg),
        (err) => setDepositMessage("입금내역 업로드 실패: " + err)
      );
    } catch (error) {
      console.error("입금내역 업로드 오류:", error);
      setDepositMessage("업로드 중 오류 발생: " + error.message);
    }
  };

  const handleDepDownload = async () => {
    setDepDownloadMessage("입금내역 엑셀 다운로드 시작...");
    setDepDownloadProgress("");
    try {
      await downloadDepositHistoryExcel(
        (prog) => setDepDownloadProgress(prog),
        (fileName) => setDepDownloadMessage("다운로드 완료: " + fileName),
        (err) => setDepDownloadMessage("다운로드 실패: " + err)
      );
    } catch (error) {
      console.error("입금내역 다운로드 오류:", error);
      setDepDownloadMessage("다운로드 중 오류 발생: " + error.message);
    }
  };

  // ────────────── 환불 파일 업로드/다운로드 ──────────────
  const handleRefundFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) setRefundFile(files[0]);
  };

  const handleRefundUpload = async () => {
    if (!refundFile) {
      setRefundMessage("환불 파일을 선택해주세요.");
      return;
    }
    setRefundMessage("환불 파일 업로드 시작...");
    setRefundProgress("");
    try {
      await uploadRefundFileWithProgress(
        refundFile,
        (prog) => setRefundProgress(prog),
        (msg) => setRefundMessage("환불 파일 업로드 완료: " + msg),
        (err) => setRefundMessage("환불 파일 업로드 실패: " + err)
      );
    } catch (error) {
      console.error("환불 파일 업로드 오류:", error);
      setRefundMessage("업로드 중 오류 발생: " + error.message);
    }
  };

  const handleRefundDownload = async () => {
    setRefundDownloadMessage("환불 파일 다운로드 시작...");
    setRefundDownloadProgress("");
    try {
      await downloadRefundFile(
        (prog) => setRefundDownloadProgress(prog),
        (fileName) => setRefundDownloadMessage("다운로드 완료: " + fileName),
        (err) => setRefundDownloadMessage("다운로드 실패: " + err)
      );
    } catch (error) {
      console.error("환불 파일 다운로드 오류:", error);
      setRefundDownloadMessage("다운로드 중 오류 발생: " + error.message);
    }
  };

  return (
    <div className={styles.mainbody}>
      {/* 고객 파일 섹션 */}
      <div className={styles.rowContainer}>
        <div className={styles.excelcontainer}>
          <h3>고객 파일 업로드 (엑셀, SSE 진행도)</h3>
          <ExcelFileInputbox
            name="customerFileUpload"
            handleChange={handleCustomerFileChange}
            value={customerFile ? customerFile.name : ""}
            isupload={!!customerFile}
          />
          <button className={styles.contractButton} onClick={handleCustomerUpload}>
            고객 파일 업로드
          </button>
          {customerMessage && <p>{customerMessage}</p>}
          {customerProgress && (
            <>
              <p>진행도: {customerProgress}</p>
              {renderProgressBar(customerProgress)}
            </>
          )}
          <h3>고객 파일 다운로드</h3>
          <button className={styles.editButton} onClick={handleRegFileDownload}>
            고객 파일 다운로드
          </button>
          {regMessage && <p>{regMessage}</p>}
          {regProgress && (
            <>
              <p>진행도: {regProgress}</p>
              {renderProgressBar(regProgress)}
            </>
          )}
        </div>
      </div>
      <hr />

      {/* 입금내역 파일 섹션 */}
      <div className={styles.rowContainer}>
        <div className={styles.excelcontainer}>
          <h3>입금내역 업로드 (엑셀, SSE 진행도)</h3>
          <ExcelFileInputbox
            name="depositFileUpload"
            handleChange={handleDepositFileChange}
            value={depositFile ? depositFile.name : ""}
            isupload={!!depositFile}
          />
          <button className={styles.contractButton} onClick={handleDepositUpload}>
            입금내역 업로드
          </button>
          {depositMessage && <p>{depositMessage}</p>}
          {depositProgress && (
            <>
              <p>진행도: {depositProgress}</p>
              {renderProgressBar(depositProgress)}
            </>
          )}
          <h3>입금내역 엑셀 다운로드</h3>
          <button className={styles.editButton} onClick={handleDepDownload}>
            입금내역 다운로드
          </button>
          {depDownloadMessage && <p>{depDownloadMessage}</p>}
          {depDownloadProgress && (
            <>
              <p>진행도: {depDownloadProgress}</p>
              {renderProgressBar(depDownloadProgress)}
            </>
          )}
        </div>
      </div>
      <hr />

      {/* 환불 파일 섹션 */}
      <div className={styles.rowContainer}>
        <div className={styles.excelcontainer}>
          <h3>환불 파일 업로드 (엑셀, SSE 진행도)</h3>
          <ExcelFileInputbox
            name="refundFileUpload"
            handleChange={handleRefundFileChange}
            value={refundFile ? refundFile.name : ""}
            isupload={!!refundFile}
          />
          <button className={styles.contractButton} onClick={handleRefundUpload}>
            환불 파일 업로드
          </button>
          {refundMessage && <p>{refundMessage}</p>}
          {refundProgress && (
            <>
              <p>진행도: {refundProgress}</p>
              {renderProgressBar(refundProgress)}
            </>
          )}
          <h3>환불 파일 다운로드</h3>
          <button className={styles.editButton} onClick={handleRefundDownload}>
            환불 파일 다운로드
          </button>
          {refundDownloadMessage && <p>{refundDownloadMessage}</p>}
          {refundDownloadProgress && (
            <>
              <p>진행도: {refundDownloadProgress}</p>
              {renderProgressBar(refundDownloadProgress)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(FilecontrolPage);
