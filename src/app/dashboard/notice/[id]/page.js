// src/app/dashboard/notice/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../../../styles/Dashboard.module.scss";
import { fetchNoticeDetail } from "@/utils/api";

export default function NoticePage({ params }) {
  const { id } = params;
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNoticeDetail(id)
      .then((data) => setNotice(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!notice) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.MainTitle}>
        <div className={styles.Notice}>
          <div className={styles.NoticeTitle}>{notice.title}</div>
          <div
            className={styles.NoticeContent}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {notice.content}
          </div>
          <div style={{ marginTop: "10px", display: "flex", gap: "16px" }}>
            <span className={styles.NoticeBottonFont}>
              수정일: {new Date(notice.updatedAt).toLocaleDateString()}
            </span>
            <span className={styles.NoticeBottonFont}>
              작성자: {notice.author || "관리자"}
            </span>
          </div>
          <div style={{ marginTop: "20px" }}>
            <Link href="/dashboard">
              <button className={styles.Bottonfont}>뒤로가기</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
