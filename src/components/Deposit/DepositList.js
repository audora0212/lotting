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
    <div className={depositStyles.tableWrapper}>
      {/* 테이블 헤더 */}
      <div className={depositStyles.tablecontainer}>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("id")}>
          <span>
            ID
            <span className={depositStyles.sortIcon}>{getSortIcon("id")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("transactionDateTime")}>
          <span>
            거래일시
            <span className={depositStyles.sortIcon}>{getSortIcon("transactionDateTime")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("description")}>
          <span>
            적요
            <span className={depositStyles.sortIcon}>{getSortIcon("description")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("details")}>
          <span>
            기재내용
            <span className={depositStyles.sortIcon}>{getSortIcon("details")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("contractor")}>
          <span>
            계약자
            <span className={depositStyles.sortIcon}>{getSortIcon("contractor")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("withdrawnAmount")}>
          <span>
            찾으신금액
            <span className={depositStyles.sortIcon}>{getSortIcon("withdrawnAmount")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositAmount")}>
          <span>
            맡기신금액
            <span className={depositStyles.sortIcon}>{getSortIcon("depositAmount")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("balanceAfter")}>
          <span>
            거래 후 잔액
            <span className={depositStyles.sortIcon}>{getSortIcon("balanceAfter")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("branch")}>
          <span>
            취급점
            <span className={depositStyles.sortIcon}>{getSortIcon("branch")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("account")}>
          <span>
            계좌
            <span className={depositStyles.sortIcon}>{getSortIcon("account")}</span>
          </span>
        </div>
        {/* 1차 ~ 10차 */}
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase1")}>
          <span>
            1차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase1")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase2")}>
          <span>
            2차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase2")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase3")}>
          <span>
            3차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase3")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase4")}>
          <span>
            4차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase4")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase5")}>
          <span>
            5차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase5")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase6")}>
          <span>
            6차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase6")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase7")}>
          <span>
            7차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase7")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase8")}>
          <span>
            8차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase8")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase9")}>
          <span>
            9차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase9")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("depositPhase10")}>
          <span>
            10차
            <span className={depositStyles.sortIcon}>{getSortIcon("depositPhase10")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("loanRecord")}>
          <span>
            loan_record
            <span className={depositStyles.sortIcon}>{getSortIcon("loanRecord")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("selfRecord")}>
          <span>
            self_record
            <span className={depositStyles.sortIcon}>{getSortIcon("selfRecord")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("computedDate")}>
          <span>
            일자
            <span className={depositStyles.sortIcon}>{getSortIcon("computedDate")}</span>
          </span>
        </div>
        <div className={depositStyles.unitContainer} onClick={() => handleSort("remarks")}>
          <span>
            비고
            <span className={depositStyles.sortIcon}>{getSortIcon("remarks")}</span>
          </span>
        </div>
      </div>

      {/* 테이블 바디 */}
      {sortedData.map((item, idx) => {
        let computedDate = "N/A";
        if (item.loanRecord) {
          computedDate = item.loanDetails?.loandate
            ? new Date(item.loanDetails.loandate).toLocaleDateString()
            : "N/A";
        } else if (item.selfRecord && !isNaN(Number(item.selfRecord))) {
          computedDate = item.loanDetails?.selfdate
            ? new Date(item.loanDetails.selfdate).toLocaleDateString()
            : "N/A";
        }
        return (
          <div className={depositStyles.maincontainer} key={idx}>
            <Link href="#" className={depositStyles.link}>
              <div className={depositStyles.rowContainer}>
                <div className={depositStyles.unitContainer}>{item.id || "N/A"}</div>
                <div className={depositStyles.unitContainer}>
                  {item.transactionDateTime
                    ? new Date(item.transactionDateTime).toLocaleString()
                    : "N/A"}
                </div>
                <div className={depositStyles.unitContainer}>{item.description || ""}</div>
                <div className={depositStyles.unitContainer}>{item.details || ""}</div>
                <div className={depositStyles.unitContainer}>{item.contractor || "N/A"}</div>
                <div className={depositStyles.unitContainer}>
                  {item.withdrawnAmount ? item.withdrawnAmount.toLocaleString() : "0"}
                </div>
                <div className={depositStyles.unitContainer}>
                  {item.depositAmount ? item.depositAmount.toLocaleString() : "0"}
                </div>
                <div className={depositStyles.unitContainer}>
                  {item.balanceAfter ? item.balanceAfter.toLocaleString() : "0"}
                </div>
                <div className={depositStyles.unitContainer}>{item.branch || ""}</div>
                <div className={depositStyles.unitContainer}>{item.account || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase1 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase2 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase3 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase4 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase5 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase6 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase7 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase8 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase9 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.depositPhase10 || ""}</div>
                <div className={depositStyles.unitContainer}>{item.loanRecord || ""}</div>
                <div className={depositStyles.unitContainer}>{item.selfRecord || ""}</div>
                <div className={depositStyles.unitContainer}>{computedDate}</div>
                <div className={depositStyles.unitContainer}>{item.remarks || ""}</div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DepositList;
