"use client";

import { useState } from "react";
import styles from "@/styles/Create.module.scss";
import withAuth from "@/utils/hoc/withAuth";
import { ExcelFileInputbox } from "@/components/Inputbox";

import {
  uploadExcelFileWithProgress,
  downloadRegFile,
} from "@/utils/api";

function FilecontrolPage() {
  // 업로드할 파일
  const [file, setFile] = useState(null);
  // 진행 상태/메시지
  const [uploadMessage, setUploadMessage] = useState("");
  // 진행도 (예: "3/30")
  const [progress, setProgress] = useState("");

  // 파일 선택
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  // 업로드 버튼 (기존 업로드 기능)
  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("파일을 선택해주세요.");
      return;
    }
    // 초기화
    setUploadMessage("업로드 시작...");
    setProgress("");

    try {
      await uploadExcelFileWithProgress(
        file,
        (prog) => {
          // onProgress
          setProgress(prog); // 예: "3/30"
        },
        (msg) => {
          // onComplete
          setUploadMessage("작업 완료: " + msg);
        },
        (err) => {
          // onError
          setUploadMessage("업로드 실패: " + err);
        }
      );

      if (!uploadMessage) {
        setUploadMessage("업로드가 종료되었습니다.");
      }
    } catch (error) {
      console.error("업로드 오류:", error);
      setUploadMessage("업로드 중 오류 발생: " + error.message);
    }
  };

  // Reg 파일 다운로드 버튼
  const handleRegFileDownload = async () => {
    setUploadMessage("Reg 파일 다운로드 시작...");
    setProgress("");
    try {
      await downloadRegFile(
        (prog) => {
          setProgress(prog);
        },
        (fileName) => {
          setUploadMessage("다운로드 완료: " + fileName);
        },
        (err) => {
          setUploadMessage("다운로드 실패: " + err);
        }
      );
    } catch (error) {
      console.error("Reg 파일 다운로드 실패:", error);
      setUploadMessage("Reg 파일 다운로드 실패: " + error.message);
    }
  };

  return (
    <div className={styles.content_container}>
      <div>
        <span>파일 업로드 (엑셀, SSE 진행도)</span>
        <ExcelFileInputbox
          name="fileupload"
          handleChange={handleFileChange}
          value={file ? file.name : ""}
          isupload={!!file}
        />
        <button onClick={handleUpload}>업로드</button>
        {uploadMessage && <p>{uploadMessage}</p>}
        {progress && <p>진행도: {progress}</p>}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <span>Reg 파일 다운로드</span>
        <button onClick={handleRegFileDownload}>다운로드 버튼</button>
      </div>
    </div>
  );
}

export default withAuth(FilecontrolPage);
