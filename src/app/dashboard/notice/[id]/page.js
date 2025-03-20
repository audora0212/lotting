"use client";
import React from "react";
import Link from "next/link";
import styles from "../../../../styles/Dashboard.module.scss";

// 실제 환경에서는 API 호출 등을 통해 데이터를 가져올 수 있습니다.
// 아래는 예시를 위한 임시 함수입니다.
async function fetchNoticeDetail(id) {
  return {
    id,
    title: `공지사항 제목 ${id}`,
    content: `이것은 공지사항 ${id}의 상세 내용입니다.\n\n공지사항에 대한 자세한 설명을 작성할 수 있습니다.`,
    date: "2024년 11월 20일",
    author: "관리자",
  };
}

export default async function NoticePage({ params }) {
  const { id } = params;
  // 공지사항 상세 데이터 호출
  const notice = await fetchNoticeDetail(id);

  return (
    <div className={styles.container}>
      <div className={styles.MainTitle}>
        {/* 공지사항 상세 영역 */}
        <div className={styles.Notice}>
          <div className={styles.NoticeTitle}>{notice.title}</div>
          {/* 내용 표시: white-space로 줄바꿈을 살리고, 글자가 깨지지 않게 처리 */}
          <div
            className={styles.NoticeContent}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {notice.content}
          </div>

          {/* 작성일, 작성자 */}
          <div style={{ marginTop: "10px", display: "flex", gap: "16px" }}>
            <span className={styles.NoticeBottonFont}>{notice.date}</span>
            <span className={styles.NoticeBottonFont}>{notice.author}</span>
          </div>

          {/* 뒤로가기 버튼 */}
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
