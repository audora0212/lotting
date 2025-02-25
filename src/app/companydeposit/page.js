"use client";
// src/app/inputmoney/deposit/[id]/page.js
import React, { useState, useEffect } from "react";
import styles from "@/styles/DepositAdd.module.scss";
import { InputboxGray } from "@/components/Inputbox";
import Link from "next/link";
import Swal from "sweetalert2";

import {
  fetchDepositHistoriesByCustomerId,
  createDepositHistory,
  deleteDepositHistory,
} from "@/utils/api";

// 숫자 입력란에 대해 자동으로 콤마를 추가하는 헬퍼 함수
const formatNumberWithCommas = (value) => {
  if (value === "" || isNaN(Number(value))) return "";
  return Number(value).toLocaleString();
};

function CompanyDepositPage() {
  // 고객 id를 "1"로 고정
  const userId = "1";

  // 초기 formData: 적요는 description, 비고는 remarks로 분리합니다.
  const [formData, setFormData] = useState({
    transactionDateTime: "",
    description: "", // "적요" → 백엔드의 description 필드에 저장됨
    details: "",
    remarks: "", // "비고(메모)"
    contractor: "",
    withdrawnAmount: "",
    depositAmount: "",
    balanceAfter: "",
    branch: "",
    account: "",
    depositPhase1: "",
    customer: { id: userId },
  });

  const [depositData, setDepositData] = useState([]);

  // 고객 id "1"에 해당하는 입금내역 페칭
  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const data = await fetchDepositHistoriesByCustomerId(userId);
        setDepositData(data);
      } catch (error) {
        console.error("Error fetching deposits:", error);
        setDepositData([]);
      }
    };
    loadDeposits();
  }, [userId]);

  // 숫자 입력란으로 사용할 필드 목록
  const numericFields = ["withdrawnAmount", "depositAmount", "balanceAfter"];

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (numericFields.includes(name)) {
      // 입력된 값에서 콤마 제거 후 숫자로 파싱, 그리고 바로 toLocaleString 적용
      let numericValue = value.replace(/,/g, "");
      if (numericValue === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      } else if (!isNaN(Number(numericValue))) {
        const formatted = formatNumberWithCommas(numericValue);
        setFormData((prev) => ({ ...prev, [name]: formatted }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 필수 입력 필드 유효성 검사:
    if (
      !formData.transactionDateTime.trim() ||
      !formData.details.trim() ||
      !formData.contractor.trim() ||
      (
        !formData.withdrawnAmount.trim() &&
        !formData.depositAmount.trim()
      )
    ) {
      Swal.fire({
        icon: "warning",
        title: "필수 항목 누락",
        text: "거래일시, 기재내용, 계약자, 그리고 찾으신 금액 또는 맡기신 금액 중 하나는 필수 입력 필드입니다.",
      });
      return;
    }

    // 전송 전, 숫자형 필드는 콤마를 제거하여 순수 숫자 문자열로 변환
    const submitData = {
      ...formData,
      withdrawnAmount: formData.withdrawnAmount.replace(/,/g, ""),
      depositAmount: formData.depositAmount.replace(/,/g, ""),
      balanceAfter: formData.balanceAfter.replace(/,/g, ""),
    };
    console.log("📌 최종 전송 데이터:", JSON.stringify(submitData, null, 2));
    try {
      await createDepositHistory(submitData);
      Swal.fire({
        icon: "success",
        title: "성공",
        text: "데이터가 성공적으로 저장되었습니다.",
      });
      
      const updatedDeposits = await fetchDepositHistoriesByCustomerId(userId);
      setDepositData(updatedDeposits);
    } catch (error) {
      console.error("Error creating deposit history:", error);
      Swal.fire({
        icon: "error",
        title: "실패",
        text: "데이터 저장에 실패했습니다.",
      });
      
    }
  };

  const handleDelete = async (depositId) => {
    Swal.fire({
      icon: "warning",
      title: "정말 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDepositHistory(depositId);
          Swal.fire({
            icon: "success",
            title: "삭제되었습니다.",
          });
          const updatedDeposits = await fetchDepositHistoriesByCustomerId(userId);
          setDepositData(updatedDeposits);
        } catch (error) {
          console.error("Error deleting deposit history:", error);
          Swal.fire({
            icon: "error",
            title: "삭제에 실패했습니다.",
          });
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2>거래내역 추가 (기업 기록용)</h2>
      <form onSubmit={handleSubmit}>
        {/* 상단 입력란: 거래일시, 적요(description), 기재내용, 비고(remarks) */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래일시</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="datetime-local"
                name="transactionDateTime"
                value={formData.transactionDateTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>적요</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>기재내용</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="details"
                value={formData.details}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* 중단 입력란: 계약자, depositPhase1, 찾으신 금액, 맡기신 금액 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>계약자</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="contractor"
                value={formData.contractor}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* depositPhase1 입력란 */}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>1차</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="depositPhase1"
                value={formData.depositPhase1}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>찾으신 금액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="withdrawnAmount"
                value={formData.withdrawnAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>맡기신 금액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* 하단 입력란: 거래 후 잔액, 취급점, 계좌, 비고 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래 후 잔액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="balanceAfter"
                value={formData.balanceAfter}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>취급점</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>계좌</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="account"
                value={formData.account}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* 새로 추가: 비고 입력란 */}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>비고</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.contractButton}>
            추가하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompanyDepositPage;
