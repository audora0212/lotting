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
  fetchPendingPhases,
  fetchCustomerById, // 전체 Customer 객체를 반환 (Loan, Status 등 포함)
  deleteDepositHistory, // 삭제 API 함수 추가
} from "@/utils/api";

function DepositAddPage() {
  const pathname = usePathname();
  const userId = pathname.split("/")[3];

  // 대출 기록 여부 상태
  const [isLoanRecord, setIsLoanRecord] = useState(false);

  // 고객의 Status.loanExceedAmount 값을 저장할 상태
  const [statusLoanExceed, setStatusLoanExceed] = useState(0);

  const [formData, setFormData] = useState({
    transactionDateTime: "",
    remarks: "",
    details: "",
    contractor: "",
    withdrawnAmount: "", // 찾으신 금액
    depositAmount: "", // 맡기신 금액 (대출 기록 시는 계산됨)
    balanceAfter: "",
    branch: "",
    account: "",
    customer: { id: userId },
    loanDetails: {
      loandate: "",
      loanbank: "",
      loanammount: "",
      selfdate: "",
      selfammount: "",
      loanselfsum: "",
      loanselfcurrent: "",
    },
    targetPhases: [], // 선택된 납입 차수 배열
  });

  const [depositData, setDepositData] = useState([]);
  const [pendingPhases, setPendingPhases] = useState([]);
  const [selectedPhases, setSelectedPhases] = useState([]);

  // 고객별 입금내역 페칭
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

  // 대출 기록 체크 시 납입 예정 차수 및 고객의 Status.loanExceedAmount 페칭  
  // fetchCustomerById를 사용하여 전체 Customer 객체에서 Status 필드를 읽어옵니다.
  useEffect(() => {
    const loadPendingPhases = async () => {
      try {
        const data = await fetchPendingPhases(userId);
        setPendingPhases(data || []);
      } catch (error) {
        console.error("Error fetching pending phases:", error);
        setPendingPhases([]);
      }
    };
    const loadCustomerData = async () => {
      try {
        const customerData = await fetchCustomerById(userId);
        // customerData.status.loanExceedAmount 값을 숫자로 변환 (없으면 0)
        setStatusLoanExceed(Number(customerData.status.loanExceedAmount) || 0);
        console.log("Customer Data:", customerData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    if (userId && isLoanRecord) {
      loadPendingPhases();
      loadCustomerData();
    }
  }, [userId, isLoanRecord]);

  // 선택된 차수 업데이트 시 formData.targetPhases 동기화
  useEffect(() => {
    setFormData((prev) => ({ ...prev, targetPhases: selectedPhases }));
  }, [selectedPhases]);

  // 중첩 필드 업데이트 (예: loanDetails.loandate)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 계산: 대출액 + 자납액
  const computedDeposit =
    (Number(formData.loanDetails.loanammount) || 0) +
    (Number(formData.loanDetails.selfammount) || 0);
  // 선택된 납입 차수 총액 (pendingPhases에서 feesum)
  const selectedPhasesSum = pendingPhases
    .filter((phase) => selectedPhases.includes(phase.phaseNumber))
    .reduce((acc, phase) => acc + (phase.feesum || 0), 0);
  // 대출 잔액 = computedDeposit - 선택된 차수 합계 + statusLoanExceed, 음수면 0
  const computedLoanBalance = Math.max(
    0,
    computedDeposit - selectedPhasesSum + statusLoanExceed
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let submitData = { ...formData };
    if (isLoanRecord) {
      // 찾으신 금액은 0으로 고정
      submitData.withdrawnAmount = "0";
      // 맡기신 금액은 computedDeposit 값을 그대로 사용 (문자열 변환)
      submitData.depositAmount = computedDeposit.toString();
      // 대출 합계와 잔액
      submitData.loanDetails.loanselfsum = computedDeposit.toString();
      submitData.loanDetails.loanselfcurrent = computedLoanBalance.toString();
      // 대출/자납 기록임을 나타내는 loanStatus 필드를 "o"로 지정
      submitData.loanStatus = "o";
    }
    console.log("입력된 데이터:", submitData);
    try {
      await createDepositHistory(submitData);
      alert("데이터가 성공적으로 저장되었습니다.");
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

  // 단순 토글: 납입 차수 선택/해제
  const togglePhase = (phaseNumber) => {
    setSelectedPhases((prev) =>
      prev.includes(phaseNumber)
        ? prev.filter((num) => num !== phaseNumber)
        : [...prev, phaseNumber]
    );
  };

  // 배열을 n개씩 묶는 헬퍼 (한 줄에 3개씩)
  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // 삭제 기능 핸들러
  const handleDelete = async (depositId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDepositHistory(depositId);
        alert("삭제되었습니다.");
        const updatedDeposits = await fetchDepositHistoriesByCustomerId(userId);
        setDepositData(updatedDeposits);
      } catch (error) {
        console.error("Error deleting deposit history:", error);
        alert("삭제에 실패했습니다.");
      }
    }
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
          <div className={styles.unitContainer}>수정/삭제</div>
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
              <button
                className={styles.contractButton}
                onClick={() => handleDelete(item.id)}
              >
                삭제하기
              </button>
            </div>
          </div>
        ))}
      </div>
      <p></p>

      <h3>입금내역 추가</h3>
      <p></p>
      <form onSubmit={handleSubmit}>
        {/* 상단 입력란: 거래일시, 적요, 기재내용 */}
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
                name="details"
                value={formData.details}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* 중단 입력란: 계약자, 찾으신 금액 (대출 기록 시 숨김), 맡기신 금액 (대출 기록이면 계산값) */}
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
          {!isLoanRecord && (
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
          )}
          <div className={styles.unitbody}>
            <div className={styles.titlebody}>
              <label className={styles.title}>
                {isLoanRecord ? "대출액+자납액" : "맡기신 금액"}
              </label>
            </div>
            <div className={styles.contentbody}>
              {isLoanRecord ? (
                <InputboxGray
                  type="number"
                  name="depositAmount"
                  value={computedDeposit}
                  disabled
                />
              ) : (
                <InputboxGray
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* 하단 입력란: 거래 후 잔액, 취급점, 계좌 */}
        <div className={styles.infoContainer}>
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
        </div>

        {/* 대출 기록 체크박스 */}
        <div className={styles.infoContainer}>
          <div className={styles.unitbody}>
            <label className={styles.title}>
              <input
                type="checkbox"
                checked={isLoanRecord}
                onChange={(e) => setIsLoanRecord(e.target.checked)}
              />
              대출/자납 기록인가요?
            </label>
          </div>
        </div>

        {/* 대출 관련 입력란 (대출 기록 체크 시 표시) */}
        {isLoanRecord && (
          <>
            {/* Row 1: 대출일자, 대출은행, 대출액 */}
            <div className={styles.infoContainer}>
              <div className={styles.row}>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>대출일자</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="datetime-local"
                      name="loanDetails.loandate"
                      value={formData.loanDetails.loandate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>대출은행</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="text"
                      name="loanDetails.loanbank"
                      value={formData.loanDetails.loanbank}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>대출액</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="number"
                      name="loanDetails.loanammount"
                      value={formData.loanDetails.loanammount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 자납일, 자납액 */}
            <div className={styles.infoContainer}>
              <div className={styles.row}>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>자납일</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="datetime-local"
                      name="loanDetails.selfdate"
                      value={formData.loanDetails.selfdate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>자납액</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="number"
                      name="loanDetails.selfammount"
                      value={formData.loanDetails.selfammount}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: 대출 합계, 대출 잔액 */}
            <div className={styles.infoContainer}>
              <div className={styles.row}>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>대출 합계</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="number"
                      name="loanDetails.loanselfsum"
                      value={computedDeposit}
                      disabled
                    />
                  </div>
                </div>
                <div className={styles.unitbody}>
                  <div className={styles.titlebody}>
                    <label className={styles.title}>대출 잔액</label>
                  </div>
                  <div className={styles.contentbody}>
                    <InputboxGray
                      type="number"
                      name="loanDetails.loanselfcurrent"
                      value={computedLoanBalance}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 납입할 차수 선택 체크박스 (한 줄에 3개씩 표시) */}
            {pendingPhases.length > 0 ? (
              <div>
                <h4>납입할 차수 선택</h4>
                <div className={styles.checkboxContainer}>
                  {chunkArray(pendingPhases, 3).map((row, rowIndex) => (
                    <div key={rowIndex} className={styles.checkboxRow}>
                      {row.map((phase) => (
                        <label
                          key={phase.phaseNumber}
                          className={styles.checkboxLabel}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPhases.includes(phase.phaseNumber)}
                            onChange={() => togglePhase(phase.phaseNumber)}
                          />
                          {phase.phaseNumber}차 (
                          {phase.feesum?.toLocaleString() || 0}₩)
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>진행 예정 납부 차수가 없습니다.</p>
            )}
          </>
        )}

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
