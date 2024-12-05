// src/components/LateFeeList.js
"use client";

import React, { useEffect, useState } from "react";
import { fetchLateFees, cancelCustomer } from "@/utils/api";
import styles from "@/styles/Search.module.scss"; // Search.module.scss 재사용
import categoryMapping from "@/utils/categoryMapping";
import ConfirmationModal from "@/components/ConfirmationModal";
import Swal from "sweetalert2";
import Link from "next/link";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const LateFeeList = ({ name, number, linkBase }) => {
  const [lateFees, setLateFees] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLateFees(name, number);
        setLateFees(data);
      } catch (error) {
        console.error("Error fetching late fees:", error);
        // 필요 시 에러 처리 (예: 로그인 페이지로 리다이렉트)
      }
    };

    fetchData();
  }, [name, number]);

  // 정렬 핸들러
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // 정렬 아이콘 반환 함수
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <AiOutlineArrowUp size={12} color="#7152F3" />
      ) : (
        <AiOutlineArrowDown size={12} color="#7152F3" />
      );
    }
    return <AiOutlineArrowDown size={12} />;
  };

  // 정렬된 데이터 계산
  const sortedLateFees = React.useMemo(() => {
    let sortableFees = [...lateFees];
    if (sortConfig.key !== null) {
      sortableFees.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // null 또는 undefined 처리
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFees;
  }, [lateFees, sortConfig]);

  // 고객 해지 핸들러
  const handleDelete = async (id) => {
    try {
      await cancelCustomer(id);
      Swal.fire({
        icon: "success",
        title: "회원 해지",
        text: "회원이 성공적으로 해지되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        // 리스트 갱신
        setLateFees((prev) => prev.filter((fee) => fee.id !== id));
      });
    } catch (error) {
      console.error("Error cancelling customer:", error);
      Swal.fire({
        icon: "error",
        title: "해지 실패",
        text: "회원 해지 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  // 확인 모달 열기
  const openConfirmation = (id) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  // 삭제 확인
  const confirmDelete = () => {
    if (selectedCustomerId !== null) {
      handleDelete(selectedCustomerId);
      setSelectedCustomerId(null);
      setIsModalOpen(false);
    }
  };

  // 삭제 취소
  const cancelDelete = () => {
    setSelectedCustomerId(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={styles.tablecontainer}>
        {/* 테이블 헤더 */}
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("id")}
        >
          <span>
            ID
            <span className={styles.sortIcon}>{getSortIcon("id")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("lastUnpaidPhaseNumber")}
        >
          <span>
            마지막 미납 차수
            <span className={styles.sortIcon}>
              {getSortIcon("lastUnpaidPhaseNumber")}
            </span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("customertype")}
        >
          <span>
            분류
            <span className={styles.sortIcon}>{getSortIcon("customertype")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("name")}
        >
          <span>
            성명
            <span className={styles.sortIcon}>{getSortIcon("name")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("registerdate")}
        >
          <span>
            가입일
            <span className={styles.sortIcon}>{getSortIcon("registerdate")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("lateBaseDate")}
        >
          <span>
            연체기준일
            <span className={styles.sortIcon}>{getSortIcon("lateBaseDate")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("recentPaymentDate")}
        >
          <span>
            최근납부
            <span className={styles.sortIcon}>{getSortIcon("recentPaymentDate")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("daysOverdue")}
        >
          <span>
            일수
            <span className={styles.sortIcon}>{getSortIcon("daysOverdue")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("lateRate")}
        >
          <span>
            연체율 (%)
            <span className={styles.sortIcon}>{getSortIcon("lateRate")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("overdueAmount")}
        >
          <span>
            연체금액
            <span className={styles.sortIcon}>{getSortIcon("overdueAmount")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("paidAmount")}
        >
          <span>
            납입금액
            <span className={styles.sortIcon}>{getSortIcon("paidAmount")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("lateFee")}
        >
          <span>
            연체료
            <span className={styles.sortIcon}>{getSortIcon("lateFee")}</span>
          </span>
        </div>
        <div
          className={styles.unitContainer}
          onClick={() => handleSort("totalOwed")}
        >
          <span>
            내야할 돈 합계
            <span className={styles.sortIcon}>{getSortIcon("totalOwed")}</span>
          </span>
        </div>
        {/* Actions 열 제거 */}
      </div>

      {/* 테이블 바디 */}
      {sortedLateFees.map((fee) => (
        <div className={styles.maincontainer} key={fee.id}>
          <Link href={`${linkBase}${fee.id}`} className={styles.link}>
            <div className={styles.rowContainer}>
              <div className={styles.unitContainer}>{fee.id}</div>
              <div className={styles.unitContainer}>
                {fee.lastUnpaidPhaseNumber !== null
                  ? fee.lastUnpaidPhaseNumber
                  : "없음"}
              </div>
              <div className={styles.unitContainer}>
                {categoryMapping[fee.customertype] || "N/A"}
              </div>
              <div className={styles.unitContainer}>{fee.name || "N/A"}</div>
              <div className={styles.unitContainer}>
                {fee.registerdate
                  ? fee.registerdate.slice(0, 10)
                  : "N/A"}
              </div>
              <div className={styles.unitContainer}>
                {fee.lateBaseDate
                  ? fee.lateBaseDate.slice(0, 10)
                  : "N/A"}
              </div>
              <div className={styles.unitContainer}>
                {fee.recentPaymentDate
                  ? fee.recentPaymentDate.slice(0, 10)
                  : "N/A"}
              </div>
              <div className={styles.unitContainer}>{fee.daysOverdue}</div>
              <div className={styles.unitContainer}>{fee.lateRate.toFixed(2)}</div>
              <div className={styles.unitContainer}>
                {fee.overdueAmount.toLocaleString()}원
              </div>
              <div className={styles.unitContainer}>
                {fee.paidAmount.toLocaleString()}원
              </div>
              <div className={styles.unitContainer}>
                {fee.lateFee.toFixed(2)}원
              </div>
              <div className={styles.unitContainer}>
                {fee.totalOwed.toLocaleString()}원
              </div>
            </div>
          </Link>
          {/* Actions 버튼 제거 */}
        </div>
      ))}

      {/* 확인 모달 */}
      {isModalOpen && (
        <ConfirmationModal
          message="정말로 회원을 해지하시겠습니까?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default LateFeeList;
