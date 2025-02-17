"use client";
// src/app/inputmoney/deposit/modify/[id]/page.js
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "@/styles/DepositAdd.module.scss";
import { InputboxGray } from "@/components/Inputbox";
import { fetchDepositHistory, updateDepositHistory } from "@/utils/api";

function DepositModifyPage() {
  const pathname = usePathname();
  const depositId = pathname.split("/")[4]; // URL에서 depositHistory id 추출
  const router = useRouter();

  // DepositHistory 엔티티와 동일한 필드명 사용
  const [formData, setFormData] = useState({
    transactionDateTime: "",
    remarks: "",
    details: "",
    contractor: "",
    withdrawnAmount: "",
    depositAmount: "",
    balanceAfter: "",
    branch: "",
    account: "",
  });

  // 단일 입금내역 페칭 (GET /deposit/{depositId})
  useEffect(() => {
    const loadDeposit = async () => {
      try {
        const data = await fetchDepositHistory(depositId);
        setFormData({
          transactionDateTime: data.transactionDateTime || "",
          remarks: data.remarks || "",
          details: data.details || "",
          contractor: data.contractor || "",
          withdrawnAmount: data.withdrawnAmount || "",
          depositAmount: data.depositAmount || "",
          balanceAfter: data.balanceAfter || "",
          branch: data.branch || "",
          account: data.account || "",
        });
      } catch (error) {
        console.error("Error fetching deposit record:", error);
      }
    };

    if (depositId) {
      loadDeposit();
    }
  }, [depositId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("수정된 데이터:", formData);
    try {
      await updateDepositHistory(depositId, formData);
      alert("데이터가 저장되었습니다.");
      router.back();
    } catch (error) {
      console.error("Error updating deposit history:", error);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      <p></p>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>입금내역 ID</span>
          </div>
          <div className={styles.contentbody}>
            <span>{depositId || "."}</span>
          </div>
        </div>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>성명</span>
          </div>
          <div className={styles.contentbody}>
            <span>{formData.contractor || "."}</span>
          </div>
        </div>
      </div>

      <h3>입금내역 수정</h3>
      <p></p>
      <form onSubmit={handleSave}>
        <div className={styles.infoContainer}>
          {/* 거래일시 */}
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
          {/* 적요 */}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>적요</label>
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
          {/* 기재내용 */}
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

        <div className={styles.infoContainer}>
          {/* 계약자 */}
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
          {/* 찾으신 금액 */}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>찾으신 금액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="number"
                name="withdrawnAmount"
                value={formData.withdrawnAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* 맡기신 금액 */}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>맡기신 금액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.infoContainer}>
          {/* 거래 후 잔액 */}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래 후 잔액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="number"
                name="balanceAfter"
                value={formData.balanceAfter}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* 취급점 */}
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
          {/* 계좌 */}
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
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.contractButton}>
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepositModifyPage;
