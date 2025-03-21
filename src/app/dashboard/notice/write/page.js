// src/app/dashboard/notice/write/page.js
"use client";
import React, { useState } from "react";
import styles from "../../../../styles/Dashboard.module.scss";
import { createNotice } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function NoticeWritePage() {
  const [notice, setNotice] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await createNotice(notice);
      alert("공지사항 등록 완료!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("공지사항 등록 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.MainTitle}>
        <h2>공지사항 작성 (관리자 전용)</h2>
        <div className={styles.FormGroup}>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            placeholder="공지사항 제목 입력"
            value={notice.title}
            onChange={(e) =>
              setNotice({ ...notice, title: e.target.value })
            }
          />
        </div>
        <div className={styles.FormGroup}>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            placeholder="공지사항 내용을 입력"
            value={notice.content}
            onChange={(e) =>
              setNotice({ ...notice, content: e.target.value })
            }
            rows={8}
          />
        </div>
        <div className={styles.FormGroup}>
          <label htmlFor="author">작성자</label>
          <input
            id="author"
            type="text"
            placeholder="작성자 입력"
            value={notice.author}
            onChange={(e) =>
              setNotice({ ...notice, author: e.target.value })
            }
          />
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className={styles.FormGroup}>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "등록중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}
