// src/components/DepositList.js
"use client";

import React, { useEffect, useState, useMemo } from "react";
import depositStyles from "@/styles/Deposit.module.scss";
import { fetchDepositData } from "@/utils/api"; // api.js의 함수 임포트
import Swal from "sweetalert2";
import Link from "next/link";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

/**
 * DepositList 컴포넌트는 입금 내역을 테이블 형태로 표시합니다.
 * - contractor: 계약자 이름 필터
 * - memberNumber: 회원번호 필터
 * - setDepositData: 상위 컴포넌트에 데이터 업데이트
 * - sortConfig: 정렬 설정
 * - setSortConfig: 정렬 설정 업데이트
 */
const DepositList = ({
  contractor,
  memberNumber,
  setDepositData,
  sortConfig,
  setSortConfig,
}) => {
  const [rawData, setRawData] = useState([]);

  // 데이터 페칭
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchDepositData();
        setRawData(data);
      } catch (error) {
        console.error("입금 내역을 불러오는 데 실패했습니다.", error);
      }
    };
    getData();
  }, []);

  // 필터링
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchContractor = contractor
        ? item.contractor && item.contractor.includes(contractor)
        : true;
      const matchMemberNumber = memberNumber
        ? item.memberNumber &&
          String(item.memberNumber).includes(String(memberNumber))
        : true;
      return matchContractor && matchMemberNumber;
    });
  }, [rawData, contractor, memberNumber]);

  // 정렬
  const sortedData = useMemo(() => {
    const dataCopy = [...filteredData];
    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // 날짜 처리
        if (
          sortConfig.key === "lastTransactionDateTime" ||
          sortConfig.key === "loanDate"
        ) {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        }

        // 숫자/문자 비교 처리
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
    return dataCopy;
  }, [filteredData, sortConfig]);

  // 상위 컴포넌트 상태 업데이트
  useEffect(() => {
    setDepositData(sortedData);
  }, [sortedData, setDepositData]);

  // 정렬 아이콘 반환 함수
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <AiOutlineArrowUp size={10} color="#7152F3" />
      ) : (
        <AiOutlineArrowDown size={10} color="#7152F3" />
      );
    }
    return <AiOutlineArrowDown size={10} />;
  };

  // 정렬 핸들러
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (

    <div className={depositStyles.tableWrapper}>
      {/* 테이블 헤더 */}
      <div className={depositStyles.tablecontainer}>
        <div
          className={depositStyles.unitContainer}
          onClick={() => handleSort("memberNumber")}
        >
          <span>
            회원번호
            <span className={depositStyles.sortIcon}>
              {getSortIcon("memberNumber")}
            </span>
          </span>
        </div>
        <div
          className={depositStyles.unitContainer}
          onClick={() => handleSort("lastTransactionDateTime")}
        >
          <span>
            마지막 거래 일시
            <span className={depositStyles.sortIcon}>
              {getSortIcon("lastTransactionDateTime")}
            </span>
          </span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>적요</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>기재내용</span>
        </div>
        <div
          className={depositStyles.unitContainer}
          onClick={() => handleSort("contractor")}
        >
          <span>
            계약자
            <span className={depositStyles.sortIcon}>
              {getSortIcon("contractor")}
            </span>
          </span>
        </div>
        <div
          className={depositStyles.unitContainer}
          onClick={() => handleSort("withdrawnAmount")}
        >
          <span>
            환불금액
            <span className={depositStyles.sortIcon}>
              {getSortIcon("withdrawnAmount")}
            </span>
          </span>
        </div>
        <div
          className={depositStyles.unitContainer}
          onClick={() => handleSort("depositAmount")}
        >
          <span>
            입금 총액
            <span className={depositStyles.sortIcon}>
              {getSortIcon("depositAmount")}
            </span>
          </span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>취급점</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>계좌</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>예약</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>1차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>2차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>3차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>4차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>5차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>6차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>7차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>8차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>9차</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>10차</span>
        </div>
        <div
          className={depositStyles.unitContainer}
          onClick={() => handleSort("loanAmount")}
        >
          <span>
            대출금액
            <span className={depositStyles.sortIcon}>
              {getSortIcon("loanAmount")}
            </span>
          </span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>대출일자</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>임시</span>
        </div>
        <div className={depositStyles.unitContainer}>
          <span>비고</span>
        </div>
      </div>

      {/* 테이블 바디 */}
      {sortedData.map((item, idx) => (
        <div className={depositStyles.maincontainer} key={idx}>
          <Link href="#" className={depositStyles.link}>
            <div className={depositStyles.rowContainer}>
              <div className={depositStyles.unitContainer}>
                {item.memberNumber || "N/A"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.lastTransactionDateTime
                  ? new Date(item.lastTransactionDateTime).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.remarks || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.memo || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.contractor || "N/A"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.withdrawnAmount
                  ? item.withdrawnAmount.toLocaleString()
                  : "0"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositAmount
                  ? item.depositAmount.toLocaleString()
                  : "0"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.bankBranch || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.account || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.reservation || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase1 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase2 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase3 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase4 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase5 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase6 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase7 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase8 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase9 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.depositPhase10 || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.loanAmount
                  ? item.loanAmount.toLocaleString()
                  : "0"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.loanDate
                  ? new Date(item.loanDate).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.temporary || ""}
              </div>
              <div className={depositStyles.unitContainer}>
                {item.note || ""}
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* (선택) 해지/삭제 모달 */}
      {/* 필요 시 아래 주석을 해제하고 ConfirmationModal 컴포넌트를 구현하세요.
      {isModalOpen && (
        <ConfirmationModal
          message="정말로 이 항목을 해지하시겠습니까?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      */}
    </div>
  );
};

export default DepositList;
