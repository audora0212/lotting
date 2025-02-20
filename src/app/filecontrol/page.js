"use client";

import { useState } from "react";
import { ExcelFileInputbox } from "@/components/Inputbox";
import withAuth from "@/utils/hoc/withAuth";
import styles from "@/styles/Create.module.scss";
import { uploadExcelFile, downloadRegFile } from "@/utils/api";

function FilecontrolPage() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    console.log(e.target.files);
    const { files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("파일을 선택해주세요.");
      return;
    }
    try {
      await uploadExcelFile(file);
      setUploadStatus("업로드 및 데이터 처리 완료");
    } catch (error) {
      setUploadStatus("업로드 실패: " + error.message);
    }
  };

  const handleRegFileDownload = async () => {
    try {
      await downloadRegFile();
    } catch (error) {
      console.error("Reg 파일 다운로드 실패:", error);
    }
  };

  return (
    <div className={styles.content_container}>
      <div>
        <span>파일업로드 (엑셀)</span>
        <ExcelFileInputbox
          name="fileupload"
          handleChange={handleFileChange}
          value={file ? file.name : ""}
          isupload={!!file}
        />
        <button onClick={handleUpload}>업로드</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
      <div>
        <span>Reg 파일 다운로드</span>
        <button onClick={handleRegFileDownload}>다운로드 버튼</button>
      </div>
    </div>
  );
}

export default withAuth(FilecontrolPage);
