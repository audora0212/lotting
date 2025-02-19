// pages/filecontrol.js (또는 FilecontrolPage.js)
"use client";

import { useState } from "react";
import { ExcelFileInputbox } from "@/components/Inputbox"; // 파일 업로드 컴포넌트
import withAuth from "@/utils/hoc/withAuth";
import styles from "@/styles/Create.module.scss"; // 필요한 스타일 (원본과 동일)

function FilecontrolPage() {
  const [file, setFile] = useState(null);
  const [isupload, setIsupload] = useState({
    isuploaded: false,
  });

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setIsupload({ isuploaded: true });
    }
  };

  return (
    <div className={styles.content_container}>
      <div>
        <span>파일업로드</span>
        <ExcelFileInputbox
          name="fileupload"
          handleChange={handleFileChange}
          value={file ? file.name : ""}
          isupload={isupload.isuploaded}
        />
      </div>
    </div>
  );
}


export default withAuth(FilecontrolPage);
