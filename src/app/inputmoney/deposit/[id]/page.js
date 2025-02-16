"use client";
// src/app/inputmoney/deposit/[id]/page.js
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "@/styles/DepositAdd.module.scss";
import { InputboxGray } from "@/components/Inputbox";
import Link from "next/link";

function DepositAddPage() {
  const pathname = usePathname();
  const userId = pathname.split("/")[3]; // URL에서 ID 추출

  const [formData, setFormData] = useState({
    lastTransactionDateTime: "",
    remarks: "",
    memo: "",
    contractor: "",
    withdrawnAmount: "",
    depositAmount: "",
    balanceAfterTransaction: "",
    bankBranch: "",
    account: "",
  });

  const [depositData, setDepositData] = useState([]);

  // 데이터 페칭
  useEffect(() => {
    const fetchDepositData = async (userId) => {
      try {
        const response = await fetch(`/api/deposit/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch data.");
        return await response.json(); // JSON 응답 파싱
      } catch (error) {
        console.error("데이터 가져오는 중 오류 발생:", error);
        return [];
      }
    };
    

    fetchDepositData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("입력된 데이터:", formData);

    const saveData = async () => {
      try {
        const response = await fetch(`/api/deposit/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("데이터가 성공적으로 저장되었습니다.");
        } else {
          alert("데이터 저장에 실패했습니다.");
        }
      } catch (error) {
        console.error("데이터 저장 중 오류 발생:", error);
      }
    };

    saveData();
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
        </div>

        {depositData.map((item, index) => (
          <div className={styles.maincontainer} key={index}>
            <div className={styles.unitContainer}>
              {item.lastTransactionDateTime || "."}
            </div>
            <div className={styles.unitContainer}>{item.remarks || "."}</div>
            <div className={styles.unitContainer}>{item.memo || "."}</div>
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
              {item.balanceAfterTransaction || "."}
            </div>
            <div className={styles.unitContainer}>{item.bankBranch || "."}</div>
            <div className={styles.unitContainer}>{item.account || "."}</div>
          </div>
        ))}
      </div>
      <p></p>
      <div className={styles.buttonContainer}>
        {/* 수정하기 버튼에 Link 추가 */}
        <Link href={`/inputmoney/deposit/modify/${userId}`}>
          <button className={styles.contractButton}>수정하기</button>
        </Link>
      </div>
      <p></p>

      <h3>입금내역 추가</h3>
      <p></p>
      <form onSubmit={handleSubmit}>
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래일시</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="datetime-local"
                name="lastTransactionDateTime"
                value={formData.lastTransactionDateTime}
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
                name="remarks"
                value={formData.remarks}
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
                name="memo"
                value={formData.memo}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

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
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>거래 후 잔액</label>
            </div>
            <div className={styles.contentbody}>
              <InputboxGray
                type="number"
                name="balanceAfterTransaction"
                value={formData.balanceAfterTransaction}
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
                name="bankBranch"
                value={formData.bankBranch}
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
