"use client";
// src/app/inputmoney/deposit/[id]/page.js
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "@/styles/DepositAdd.module.scss";
import { InputboxGray } from "@/components/Inputbox";
import Link from "next/link";
import {
  fetchDepositHistoriesByCustomerId,
  createDepositHistory,
} from "@/utils/api";

function DepositAddPage() {
  const pathname = usePathname();
  const userId = pathname.split("/")[3]; // URL에서 고객 ID 추출

  // 백엔드 DepositHistory 엔티티와 일치하는 필드명을 사용합니다.
  // 필드: transactionDateTime, remarks, details, contractor, withdrawnAmount,
  // depositAmount, balanceAfter, branch, account, loanStatus
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
    customer: { id: userId },
  });

  const [depositData, setDepositData] = useState([]);

  // 고객별 입금내역을 백엔드 API (GET /deposit/customer/{userId})로 페칭합니다.
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

    if (userId) {
      loadDeposits();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("입력된 데이터:", formData);
    try {
      await createDepositHistory(formData);
      alert("데이터가 성공적으로 저장되었습니다.");
      // 저장 후 최신 입금내역 다시 페칭
      const updatedDeposits = await fetchDepositHistoriesByCustomerId(userId);
      setDepositData(updatedDeposits);
    } catch (error) {
      console.error("Error creating deposit history:", error);
      alert("데이터 저장에 실패했습니다.");
    }
  };

  const handleLoanAlert = () => {
    alert("대출 기록은 수정할 수 없습니다. 삭제 후 재입력해주세요.");
  };

  return (
    <div className={styles.container}>
      <p></p>
      <div className={styles.infoContainer}>
        <div className={styles.unitbody}>
          <div className={styles.titlebody}>
            <span className={styles.title}>관리번호</span>
          </div>
          <div className={styles.contentbody}>
            <span>{userId || "."}</span>
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

      <h3>현재 입금내역</h3>
      <p></p>
      <div className={styles.tableWrapper}>
        <div className={styles.tablecontainer}>
          <div className={styles.unitContainer}>거래일시</div>
          <div className={styles.unitContainer}>적요</div>
          <div className={styles.unitContainer}>기재내용</div>
          <div className={styles.unitContainer}>계약자</div>
          <div className={styles.unitContainer}>찾으신 금액</div>
          <div className={styles.unitContainer}>맡기신 금액</div>
          <div className={styles.unitContainer}>거래 후 잔액</div>
          <div className={styles.unitContainer}>취급점</div>
          <div className={styles.unitContainer}>계좌</div>
          <div className={styles.unitContainer}>수정</div>
        </div>

        {depositData.map((item, index) => (
          <div className={styles.maincontainer} key={index}>
            <div className={styles.unitContainer}>
              {item.transactionDateTime || "."}
            </div>
            <div className={styles.unitContainer}>{item.remarks || "."}</div>
            <div className={styles.unitContainer}>{item.details || "."}</div>
            <div className={styles.unitContainer}>
              {item.contractor || "."}
            </div>
            <div className={styles.unitContainer}>
              {item.withdrawnAmount || "."}
            </div>
            <div className={styles.unitContainer}>
              {item.depositAmount || "."}
            </div>
            <div className={styles.unitContainer}>
              {item.balanceAfter || "."}
            </div>
            <div className={styles.unitContainer}>{item.branch || "."}</div>
            <div className={styles.unitContainer}>{item.account || "."}</div>
            <div className={styles.unitContainer}>
              {item.loanStatus === "o" ? (
                <button
                  className={styles.contractButton}
                  onClick={handleLoanAlert}
                >
                  수정불가
                </button>
              ) : (
                <Link href={`/inputmoney/deposit/modify/${item.id}`}>
                  <button className={styles.contractButton}>수정하기</button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <p></p>

      <h3>입금내역 추가</h3>
      <p></p>
      <form onSubmit={handleSubmit}>
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
            추가하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default DepositAddPage;
