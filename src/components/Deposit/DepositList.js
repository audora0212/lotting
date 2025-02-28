"use client";

import React, { useEffect, useState, useMemo } from "react";
import depositStyles from "@/styles/Deposit.module.scss";
import { fetchDepositList } from "@/utils/api";
import Swal from "sweetalert2";
import Link from "next/link";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

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
        const data = await fetchDepositList();
        setRawData(data);
      } catch (error) {
        console.error("입금 내역을 불러오는 데 실패했습니다.", error);
      }
    };
    getData();
  }, []);

  // 필터링 (contractor와 memberNumber → 여기서는 id 필터로 사용)
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchContractor = contractor
        ? item.contractor && item.contractor.includes(contractor)
        : true;
      const matchMemberNumber = memberNumber
        ? item.id && String(item.id).includes(String(memberNumber))
        : true;
      return matchContractor && matchMemberNumber;
    });
  }, [rawData, contractor, memberNumber]);

  // 정렬
  const sortedData = useMemo(() => {
    const dataCopy = [...filteredData];
    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "computedDate") {
          // 'computedDate'는 대출/자납 날짜 비교 로직
          aValue = a.loanRecord
            ? a.loanDetails?.loandate
              ? new Date(a.loanDetails.loandate)
              : new Date(0)
            : a.selfRecord &&
              !isNaN(Number(a.selfRecord)) &&
              a.loanDetails?.selfdate
            ? new Date(a.loanDetails.selfdate)
            : new Date(0);
          bValue = b.loanRecord
            ? b.loanDetails?.loandate
              ? new Date(b.loanDetails.loandate)
              : new Date(0)
            : b.selfRecord &&
              !isNaN(Number(b.selfRecord)) &&
              b.loanDetails?.selfdate
            ? new Date(b.loanDetails.selfdate)
            : new Date(0);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];

          if (aValue === null || aValue === undefined) return 1;
          if (bValue === null || bValue === undefined) return -1;

          if (sortConfig.key === "transactionDateTime") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }

          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
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
    <div className={depositStyles.depositListWrapper}>
      {/* 전체 테이블 */}
      <div className={depositStyles.depositListTable}>
        {/* ===== 테이블 헤더 ===== */}
        <div className={depositStyles.depositListHeader}>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("id")}
          >
            <span>
              ID
              <span className={depositStyles.sortIcon}>{getSortIcon("id")}</span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("transactionDateTime")}
          >
            <span>
              거래일시
              <span className={depositStyles.sortIcon}>
                {getSortIcon("transactionDateTime")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("description")}
          >
            <span>
              적요
              <span className={depositStyles.sortIcon}>
                {getSortIcon("description")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("details")}
          >
            <span>
              기재내용
              <span className={depositStyles.sortIcon}>
                {getSortIcon("details")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
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
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("withdrawnAmount")}
          >
            <span>
              찾으신금액
              <span className={depositStyles.sortIcon}>
                {getSortIcon("withdrawnAmount")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositAmount")}
          >
            <span>
              맡기신금액
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositAmount")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("balanceAfter")}
          >
            <span>
              거래 후 잔액
              <span className={depositStyles.sortIcon}>
                {getSortIcon("balanceAfter")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("branch")}
          >
            <span>
              취급점
              <span className={depositStyles.sortIcon}>
                {getSortIcon("branch")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("account")}
          >
            <span>
              계좌
              <span className={depositStyles.sortIcon}>
                {getSortIcon("account")}
              </span>
            </span>
          </div>
          {/* 1차 ~ 10차 */}
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase1")}
          >
            <span>
              1차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase1")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase2")}
          >
            <span>
              2차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase2")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase3")}
          >
            <span>
              3차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase3")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase4")}
          >
            <span>
              4차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase4")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase5")}
          >
            <span>
              5차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase5")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase6")}
          >
            <span>
              6차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase6")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase7")}
          >
            <span>
              7차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase7")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase8")}
          >
            <span>
              8차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase8")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase9")}
          >
            <span>
              9차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase9")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("depositPhase10")}
          >
            <span>
              10차
              <span className={depositStyles.sortIcon}>
                {getSortIcon("depositPhase10")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("loanRecord")}
          >
            <span>
              대출
              <span className={depositStyles.sortIcon}>
                {getSortIcon("loanRecord")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("selfRecord")}
          >
            <span>
              자납
              <span className={depositStyles.sortIcon}>
                {getSortIcon("selfRecord")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("computedDate")}
          >
            <span>
              일자
              <span className={depositStyles.sortIcon}>
                {getSortIcon("computedDate")}
              </span>
            </span>
          </div>
          <div
            className={depositStyles.depositListHeaderCell}
            onClick={() => handleSort("remarks")}
          >
            <span>
              비고
              <span className={depositStyles.sortIcon}>
                {getSortIcon("remarks")}
              </span>
            </span>
          </div>
        </div>

        {/* ===== 테이블 바디 ===== */}
        <div className={depositStyles.depositListBody}>
          {sortedData.map((item, idx) => {
            // computedDate 계산
            let computedDate = "";
            if (item.loanRecord) {
              computedDate = item?.loanDate
                ? new Date(item.loanDate).toLocaleDateString()
                : "N/A";
            } else if (item.selfRecord && !isNaN(Number(item.selfRecord))) {
              computedDate = item?.selfDate
                ? new Date(item.selfDate).toLocaleDateString()
                : "N/A";
            }

            return (
              <div className={depositStyles.depositListBodyRow} key={idx}>
                {/* ID */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.id || "N/A"}
                  </Link>
                </div>
                {/* 거래일시 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.transactionDateTime
                      ? new Date(item.transactionDateTime).toLocaleString()
                      : "N/A"}
                  </Link>
                </div>
                {/* 적요 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.description || ""}
                  </Link>
                </div>
                {/* 기재내용 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.details || ""}
                  </Link>
                </div>
                {/* 계약자 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.contractor || "N/A"}
                  </Link>
                </div>
                {/* 찾으신금액 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.withdrawnAmount
                      ? item.withdrawnAmount.toLocaleString()
                      : "0"}
                  </Link>
                </div>
                {/* 맡기신금액 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositAmount
                      ? item.depositAmount.toLocaleString()
                      : "0"}
                  </Link>
                </div>
                {/* 거래 후 잔액 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.balanceAfter
                      ? item.balanceAfter.toLocaleString()
                      : "0"}
                  </Link>
                </div>
                {/* 취급점 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.branch || ""}
                  </Link>
                </div>
                {/* 계좌 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.account || ""}
                  </Link>
                </div>
                {/* 1차 ~ 10차 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase1 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase2 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase3 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase4 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase5 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase6 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase7 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase8 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase9 || ""}
                  </Link>
                </div>
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.depositPhase10 || ""}
                  </Link>
                </div>
                {/* 대출 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.loanRecord || ""}
                  </Link>
                </div>
                {/* 자납 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.selfRecord || ""}
                  </Link>
                </div>
                {/* 일자 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {computedDate}
                  </Link>
                </div>
                {/* 비고 */}
                <div className={depositStyles.depositListBodyCell}>
                  <Link href="#" className={depositStyles.link}>
                    {item.remarks || ""}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepositList;
