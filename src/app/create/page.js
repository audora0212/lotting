"use client";
import styles from "@/styles/Create.module.scss";
import Swal from "sweetalert2";
import {
  Inputbox,
  PostInputbox,
  InputAreabox,
  DropInputbox,
  FileInputbox,
  Checkbox,
  MGMInputbox,
} from "@/components/Inputbox";
import { Button_Y } from "@/components/Button";
import withAuth from "@/utils/hoc/withAuth";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  createFile,
  newIdGenerate,
  createUser,
  checkIdExists,
} from "@/utils/api";
import { useRouter } from "next/navigation";

import {
  banklist,
  classificationlist,
  typeidlist,
  typelist,
  grouplist,
  turnlist,
} from "@/components/droplistdata";

function Create() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [newid, setNewid] = useState("");
  const [idExists, setIdExists] = useState(false);
  const [checkingId, setCheckingId] = useState(false);
  const [formattedRegisterPrice, setFormattedRegisterPrice] = useState("");
  const [formattedDepositAmmount, setFormattedDepositAmmount] = useState("");

  // 파일 업로드 체크박스 상태
  const [isupload, setIsupload] = useState({
    isuploaded: false,
    sealcertificateprovided: false,
    selfsignatureconfirmationprovided: false,
    commitmentletterprovided: false,
    idcopyprovided: false,
    freeoption: false,
    forfounding: false,
    generalmeetingconsentformprovided: false,
    preferenceattachment: false,
    prizeattachment: false,
    exemption7: false,
    investmentfile: false,
    contract: false,
  });

  const [file, setFile] = useState(null);

  // 휴대폰 번호 "raw" 숫자값을 저장 (하이픈 없이 최대 8자리)
  const [phoneDigits, setPhoneDigits] = useState("");
  // 화면에 보여줄 값은 phoneDigits를 기반으로 계산 (항상 "010)" 접두어 붙임)
  const computedPhoneDisplay =
    "010)" +
    (phoneDigits.length > 4
      ? phoneDigits.slice(0, 4) + "-" + phoneDigits.slice(4)
      : phoneDigits);

  useEffect(() => {
    // 서버에서 다음 관리번호 가져오기
    const getData = async () => {
      try {
        const nextId = await newIdGenerate();
        setNewid(nextId);
        setValue("id", nextId);
      } catch (error) {
        console.error("관리번호를 가져오는데 실패했습니다:", error);
      }
    };
    getData();
  }, [setValue]);

  /** 관리번호 중복 체크 */
  const handleIdChange = async (e) => {
    const enteredId = e.target.value;
    setValue("id", enteredId);

    if (enteredId) {
      setCheckingId(true);
      try {
        const exists = await checkIdExists(enteredId);
        setIdExists(exists);
      } catch (error) {
        console.error("관리번호 중복 체크 오류:", error);
        setIdExists(true);
      } finally {
        setCheckingId(false);
      }
    } else {
      setIdExists(false);
    }
  };

  /** 체크박스 변화 */
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIsupload((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  /** 파일 업로드 변화 */
  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setIsupload((prev) => ({
        ...prev,
        isuploaded: true,
      }));
    }
  };

  /** 숫자 천단위 콤마 처리 */
  const formatNumberWithCommas = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (!numericValue) return "";
    return parseInt(numericValue, 10).toLocaleString();
  };

  const handleRegisterPriceChange = (e) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setFormattedRegisterPrice(formattedValue);
    const rawValue = formattedValue.replace(/,/g, "");
    setValue("registerprice", rawValue ? parseInt(rawValue, 10) : null);
  };

  const handleDepositAmmountChange = (e) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setFormattedDepositAmmount(formattedValue);
    const rawValue = formattedValue.replace(/,/g, "");
    setValue("deposits.depositammount", rawValue ? parseInt(rawValue, 10) : null);
  };

  /**
   * 휴대폰 번호 포맷팅 핸들러  
   * e.target.value 에서 "010)" 접두어를 제거하고, 숫자만 추출하여 최대 8자리까지 저장한 후,
   * 화면에는 "010)" + (숫자가 4자리 이상이면 중간에 하이픈 추가) 로 표시함.
   */
  const handlePhoneNumberChange = (e, onChange) => {
    let input = e.target.value;
    // 만약 입력값에서 "010)" 접두어가 있다면 제거
    if (input.startsWith("010)")) {
      input = input.slice(4);
    }
    // 숫자만 추출
    let digits = input.replace(/\D/g, "");
    // 최대 8자리까지
    digits = digits.substring(0, 8);
    setPhoneDigits(digits);
    onChange(digits);
  };

  /** 폼 검증 오류 처리 */
  const onError = (errors) => {
    console.log("검증 오류:", errors);

    const errorMessages = [];
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        if (errors[field].message) {
          errorMessages.push(errors[field].message);
        } else if (typeof errors[field] === "object" && errors[field] !== null) {
          for (const subField in errors[field]) {
            if (
              errors[field].hasOwnProperty(subField) &&
              errors[field][subField].message
            ) {
              errorMessages.push(errors[field][subField].message);
            }
          }
        }
      }
    }

    Swal.fire({
      icon: "warning",
      title: "필수 항목 누락",
      text: errorMessages.join("\n"),
    });
  };

  /** 폼 제출 */
  const onSubmit = async (data) => {
    try {
      // 파일 업로드 처리
      let uploadedFileInfo = "";
      if (file) {
        const uploadResponse = await createFile(file, parseInt(data.id, 10));
        uploadedFileInfo = uploadResponse.data;
      }

      // 숫자 변환
      const parsedData = {
        ...data,
        id: parseInt(data.id, 10),
        registerprice: parseInt(data.registerprice, 10),
        CustomerData: {
          ...data.CustomerData,
          resnumfront: parseInt(data.CustomerData.resnumfront, 10),
          resnumback: parseInt(data.CustomerData.resnumback, 10),
        },
        deposits: {
          depositdate: data.deposits.depositdate,
          depositammount: parseInt(data.deposits.depositammount, 10),
        },
      };

      // 첨부 파일 정보
      const attachments = {
        ...isupload,
        fileinfo: uploadedFileInfo,
        prizename: data.prizename,
        prizedate: data.prizedate,
      };

      // 최종 전송할 데이터
      const customerData = {
        id: parsedData.id,
        customertype: data.customertype,
        type: data.type,
        groupname: data.groupname,
        turn: data.turn,
        batch: data.batch,
        registerdate: parsedData.registerdate,
        registerprice: parsedData.registerprice,
        registerpath: data.registerpath,
        additional: data.additional,
        prizewinning: data.prizewinning,
        votemachine: data.votemachine,
        CustomerData: parsedData.CustomerData,
        LegalAddress: data.LegalAddress,
        Postreceive: data.Postreceive,
        Financial: {
          ...data.Financial,
        },
        deposits: parsedData.deposits,
        attachments: attachments,
        dahim: data.dahim,
        MGM: data.MGM,
        firstemp: data.firstemp,
        secondemp: data.secondemp,
        responsible: data.responsible,
        meetingattend: data.meetingattend,
        agenda: data.agenda,
      };

      console.log(customerData);
      const createUserResponse = await createUser(customerData);

      Swal.fire({
        icon: "success",
        title: "회원정보가 입력되었습니다.",
        text:
          "관리번호 : " +
          createUserResponse.data.id +
          "/ 회원명 : " +
          parsedData.CustomerData.name,
      });

      // 폼 리셋
      reset();
      setFile(null);
      setIsupload({
        isuploaded: false,
        sealcertificateprovided: false,
        selfsignatureconfirmationprovided: false,
        commitmentletterprovided: false,
        idcopyprovided: false,
        freeoption: false,
        forfounding: false,
        generalmeetingconsentformprovided: false,
        preferenceattachment: false,
        prizeattachment: false,
        exemption7: false,
        investmentfile: false,
        contract: false,
      });
      setIdExists(false);
      setFormattedRegisterPrice("");
      setFormattedDepositAmmount("");
      setPhoneDigits("");

      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      let errorMessage =
        "회원 정보를 입력하는 동안 오류가 발생했습니다. 다시 시도해주세요.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.fire({
        icon: "error",
        title: "회원정보 입력 실패",
        text: errorMessage,
      });
    }
  };

  // 사은품 체크박스
  const prizeattachmentChecked = watch("prizeattachment", false);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {/* 1. 회원정보 */}
        <h3>회원정보</h3>
        <div className={styles.content_container}>
          {/* 관리번호 */}
          <div className={styles.Font}>
            <label htmlFor="id"></label>
            <Inputbox
              type="number"
              id="id"
              defaultValue={newid}
              {...register("id", { required: "관리번호를 입력해주세요." })}
              onChange={handleIdChange}
              isError={!!errors.id || idExists}
            />
            {checkingId && <span className={styles.checking}>확인 중...</span>}
            {!checkingId && !idExists && watch("id") && (
              <span className={styles.availableText}> 사용가능</span>
            )}
            {idExists && (
              <span className={styles.errorText}>사용중인 관리번호</span>
            )}
            {errors.id && (
              <span className={styles.errorText}>{errors.id.message}</span>
            )}
          </div>
          <h1></h1>

          {/* 이름, 휴대폰, 주민번호 */}
          <div>
            <Inputbox
              type="text"
              placeholder="이름 *"
              register={register("CustomerData.name", {
                required: "이름을 입력해주세요.",
              })}
              isError={!!errors.CustomerData?.name}
            />
          </div>
          <div>
            <Controller
              name="CustomerData.phone"
              control={control}
              defaultValue=""
              rules={{ required: "휴대폰 번호를 입력해주세요." }}
              render={({ field: { onChange } }) => (
                <Inputbox
                  type="tel"
                  placeholder="휴대폰 번호 *"
                  value={computedPhoneDisplay}
                  onChange={(e) => handlePhoneNumberChange(e, onChange)}
                  isError={!!errors.CustomerData?.phone}
                />
              )}
            />
          </div>
          <div>
            <Inputbox
              type="number"
              placeholder="주민번호 앞자리 *"
              register={register("CustomerData.resnumfront", {
                required: "주민번호 앞자리를 입력해주세요.",
              })}
              isError={!!errors.CustomerData?.resnumfront}
            />
          </div>
          <div>
            <Inputbox
              type="number"
              placeholder="주민번호 뒷자리 *"
              register={register("CustomerData.resnumback", {
                required: "주민번호 뒷자리를 입력해주세요.",
              })}
              isError={!!errors.CustomerData?.resnumback}
            />
          </div>
          <div>
            <Inputbox
              type="email"
              placeholder="이메일"
              register={register("CustomerData.email", {})}
              isError={!!errors.CustomerData?.email}
            />
          </div>

          {/* 분류, 가입경로, 은행, 계좌, 예금주 */}
          <div>
            <DropInputbox
              list={classificationlist}
              register={register("customertype", {
                required: "분류를 선택해주세요.",
              })}
              placeholder="분류 *"
              isError={!!errors.customertype}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="가입경로"
              register={register("registerpath", {})}
              isError={!!errors.registerpath}
            />
          </div>
          <div>
            <DropInputbox
              list={banklist}
              register={register("Financial.bankname", {
                required: "은행을 선택해주세요.",
              })}
              placeholder="은행 *"
              isError={!!errors.Financial?.bankname}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="계좌번호 *"
              register={register("Financial.accountnum", {
                required: "계좌번호를 입력해주세요.",
              })}
              isError={!!errors.Financial?.accountnum}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="예금주 *"
              register={register("Financial.accountholder", {
                required: "예금주를 입력해주세요.",
              })}
              isError={!!errors.Financial?.accountholder}
            />
          </div>

          {/* 법정주소, 우편물 주소지 */}
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>법정주소 *</div>
            <PostInputbox
              register={register}
              setValue={setValue}
              namePrefix="LegalAddress"
              postcodeName="LegalAddress.postnumber"
              addressName="LegalAddress.post"
              isError={
                !!errors.LegalAddress?.postnumber ||
                !!errors.LegalAddress?.post ||
                !!errors.LegalAddress?.detailaddress
              }
            />
            <Inputbox
              type="text"
              placeholder="법정주소 상세 *"
              register={register("LegalAddress.detailaddress", {
                required: "법정주소를 입력해주세요.",
              })}
              isError={!!errors.LegalAddress?.detailaddress}
            />
          </div>
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>우편물 주소지 *</div>
            <PostInputbox
              register={register}
              setValue={setValue}
              namePrefix="Postreceive"
              postcodeName="Postreceive.postnumberreceive"
              addressName="Postreceive.postreceive"
              isError={
                !!errors.Postreceive?.postnumberreceive ||
                !!errors.Postreceive?.postreceive ||
                !!errors.Postreceive?.detailaddressreceive
              }
            />
            <Inputbox
              type="text"
              placeholder="우편물 주소지 상세 *"
              register={register("Postreceive.detailaddressreceive", {
                required: "우편물 주소지를 입력해주세요.",
              })}
              isError={!!errors.Postreceive?.detailaddressreceive}
            />
          </div>
        </div>

        {/* 2. 관리정보 */}
        <h3>관리정보</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <DropInputbox
                list={typeidlist}
                register={register("batch", {
                  required: "제출 순번을 선택해주세요.",
                })}
                placeholder="제출 순번 *"
                isError={!!errors.batch}
              />
              <DropInputbox
                list={typelist}
                register={register("type", {
                  required: "유형을 선택해주세요.",
                })}
                placeholder="유형 *"
                isError={!!errors.type}
              />
            </div>
            <div className={styles.content_body2}>
              <DropInputbox
                list={grouplist}
                register={register("groupname", {
                  required: "그룹을 선택해주세요.",
                })}
                placeholder="그룹 *"
                isError={!!errors.groupname}
              />
              <DropInputbox
                list={turnlist}
                register={register("turn", {
                  required: "순번을 선택해주세요.",
                })}
                placeholder="순번 *"
                isError={!!errors.turn}
              />
            </div>
          </div>

          {/* 가입일자, 가입가 */}
          <div className={styles.mainbody}>
            <div className={styles.content_body}>
              <div className={styles.content_body2}>
                <div className={styles.dateInputContainer}>
                  <label className={styles.dateLabel}>가입일자 *</label>
                  <Inputbox
                    type="date"
                    register={register("registerdate", {
                      required: "가입일자를 입력해주세요.",
                    })}
                    isError={!!errors.registerdate}
                  />
                </div>
              </div>
              <div className={styles.content_body2}>
                <Inputbox
                  type="text"
                  placeholder="가입가 *"
                  value={formattedRegisterPrice}
                  onChange={handleRegisterPriceChange}
                  isError={!!errors.registerprice}
                />
              </div>
            </div>

            {/* 예약금 납입일자, 예약금 */}
            <div className={styles.content_body}>
              <div className={styles.content_body2}>
                <div className={styles.dateInputContainer}>
                  <label className={styles.dateLabel}>예약금 납입일자 *</label>
                  <Inputbox
                    type="date"
                    register={register("deposits.depositdate", {
                      required: "예약금 납입일자를 입력해주세요.",
                    })}
                    isError={!!errors.deposits?.depositdate}
                  />
                </div>
              </div>
              <div className={styles.content_body2}>
                <Inputbox
                  type="text"
                  placeholder="예약금 *"
                  value={formattedDepositAmmount}
                  onChange={handleDepositAmmountChange}
                  isError={!!errors.deposits?.depositammount}
                />
              </div>
            </div>

            {/* 신탁사 제출일자 -> Financial.trustcompanydate */}
            <div className={styles.content_body}>
              <div className={styles.content_body2}>
                <div className={styles.inputRow}>
                  <div className={styles.inputLabel}>신탁사 제출일자 *</div>
                  <div className={styles.dateInputContainer}>
                    <Inputbox
                      type="date"
                      register={register("Financial.trustcompanydate", {})}
                      isError={!!errors.Financial?.trustcompanydate}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 체크박스들 */}
            <div className={styles.content_body}>
              <div className={styles.content_body3}>
                <Checkbox
                  label="7차 면제"
                  name="exemption7"
                  onChange={handleCheckboxChange}
                  register={register("exemption7")}
                  isError={!!errors.exemption7}
                />
              </div>
              <div className={styles.content_body3}>
                <Checkbox
                  label="출자금"
                  name="investmentfile"
                  onChange={handleCheckboxChange}
                  register={register("investmentfile")}
                  isError={!!errors.investmentfile}
                />
              </div>
              <div className={styles.content_body3}>
                <Checkbox
                  label="지산A동 계약서"
                  name="contract"
                  onChange={handleCheckboxChange}
                  register={register("contract")}
                  isError={!!errors.contract}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. 다힘 */}
        <h3>다힘</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="시상"
                register={register("dahim.dahimsisang")}
                isError={!!errors.dahim?.dahimsisang}
              />
            </div>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="6/30선지급"
                register={register("dahim.dahimprepaid")}
                isError={!!errors.dahim?.dahimprepaid}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="1회차청구"
                register={register("dahim.dahimfirst")}
                isError={!!errors.dahim?.dahimfirst}
              />
            </div>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="금액(만원)"
                register={register("dahim.dahimfirstpay")}
                isError={!!errors.dahim?.dahimfirstpay}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="2회차청구"
                register={register("dahim.dahimsecond")}
                isError={!!errors.dahim?.dahimsecond}
              />
            </div>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="금액"
                register={register("dahim.dahimsecondpay")}
                isError={!!errors.dahim?.dahimsecondpay}
              />
            </div>
          </div>

          {/* 날짜들 (첫/두/세번째) */}
          <div className={styles.content_body}>
            <div className={styles.content_body3}>
              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>일자(첫번째)</label>
                <MGMInputbox
                  type="date"
                  register={register("dahim.dahimdate")}
                  isError={!!errors.dahim?.dahimdate}
                />
              </div>
            </div>
            <div className={styles.content_body3}>
              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>일자(두번째)</label>
                <MGMInputbox
                  type="date"
                  register={register("dahim.dahimdate2")}
                  isError={!!errors.dahim?.dahimdate2}
                />
              </div>
            </div>
            <div className={styles.content_body3}>
              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>일자(세번째)</label>
                <MGMInputbox
                  type="date"
                  register={register("dahim.dahimdate3")}
                  isError={!!errors.dahim?.dahimdate3}
                />
              </div>
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="합계"
                register={register("dahim.dahimsum")}
                isError={!!errors.dahim?.dahimsum}
              />
            </div>
            <div className={styles.content_body2}>
              <MGMInputbox
                type="text"
                placeholder="출처"
                register={register("dahim.dahimsource")}
                isError={!!errors.dahim?.dahimsource}
              />
            </div>
          </div>
        </div>

        {/* 4. 부속서류 */}
        <h3>부속서류</h3>
        <div className={styles.attachmentContainer}>
          <div className={styles.attachmentGrid}>
            <Checkbox
              label="인감증명서"
              name="sealcertificateprovided"
              onChange={handleCheckboxChange}
              register={register("sealcertificateprovided")}
              isError={!!errors.sealcertificateprovided}
            />
            <Checkbox
              label="본인서명확인서"
              name="selfsignatureconfirmationprovided"
              onChange={handleCheckboxChange}
              register={register("selfsignatureconfirmationprovided")}
              isError={!!errors.selfsignatureconfirmationprovided}
            />
            <Checkbox
              label="확약서"
              name="commitmentletterprovided"
              onChange={handleCheckboxChange}
              register={register("commitmentletterprovided")}
              isError={!!errors.commitmentletterprovided}
            />
            <Checkbox
              label="신분증"
              name="idcopyprovided"
              onChange={handleCheckboxChange}
              register={register("idcopyprovided")}
              isError={!!errors.idcopyprovided}
            />
            <Checkbox
              label="무상옵션"
              name="freeoption"
              onChange={handleCheckboxChange}
              register={register("freeoption")}
              isError={!!errors.freeoption}
            />
            <Checkbox
              label="창준위용"
              name="forfounding"
              onChange={handleCheckboxChange}
              register={register("forfounding")}
              isError={!!errors.forfounding}
            />
            <Checkbox
              label="총회동의서"
              name="generalmeetingconsentformprovided"
              onChange={handleCheckboxChange}
              register={register("generalmeetingconsentformprovided")}
              isError={!!errors.generalmeetingconsentformprovided}
            />
            <Checkbox
              label="선호도조사"
              name="preferenceattachment"
              onChange={handleCheckboxChange}
              register={register("preferenceattachment")}
              isError={!!errors.preferenceattachment}
            />
            <Checkbox
              label="사은품"
              name="prizeattachment"
              onChange={handleCheckboxChange}
              register={register("prizeattachment")}
              isError={!!errors.prizeattachment}
            />
          </div>

          {/* 사은품 관련 */}
          {prizeattachmentChecked && (
            <div className={styles.prizeRow}>
              <Inputbox
                type="text"
                placeholder="사은품명"
                register={register("prizename")}
                isError={!!errors.prizename}
              />
              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>지급일자</label>
                <Inputbox
                  type="date"
                  register={register("prizedate")}
                  isError={!!errors.prizedate}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.content_container}>
          <div>
            <span>파일업로드</span>
            <FileInputbox
              name="fileupload"
              handleChange={handleFileChange}
              register={register("fileupload")}
              isupload={isupload.isuploaded}
              value={file ? file.name : ""}
              isError={!!errors.fileupload}
            />
          </div>
        </div>

        {/* 5. 담당자 */}
        <h3>담당자</h3>
        <div className={`${styles.content_container} ${styles.responsibleContainer}`}>
          <MGMInputbox
            type="text"
            placeholder="총괄 *"
            register={register("responsible.generalmanagement", {
              required: "총괄을 입력해주세요.",
            })}
            isError={!!errors.responsible?.generalmanagement}
          />
          <MGMInputbox
            type="text"
            placeholder="본부 *"
            register={register("responsible.division", {
              required: "본부를 입력해주세요.",
            })}
            isError={!!errors.responsible?.division}
          />
          <MGMInputbox
            type="text"
            placeholder="팀 *"
            register={register("responsible.team", {
              required: "팀을 입력해주세요.",
            })}
            isError={!!errors.responsible?.team}
          />
          <MGMInputbox
            type="text"
            placeholder="성명 *"
            register={register("responsible.managername", {
              required: "성명을 입력해주세요.",
            })}
            isError={!!errors.responsible?.managername}
          />
        </div>

        {/* 6. MGM */}
        <h3>MGM</h3>
        <div className={`${styles.content_container} ${styles.mgmContainer}`}>
          <MGMInputbox
            type="text"
            placeholder="업체명"
            register={register("MGM.mgmcompanyname")}
            isError={!!errors.MGM?.mgmcompanyname}
          />
          <MGMInputbox
            type="text"
            placeholder="이름"
            register={register("MGM.mgmname")}
            isError={!!errors.MGM?.mgmname}
          />
          <MGMInputbox
            type="text"
            placeholder="은행명"
            register={register("MGM.mgminstitution")}
            isError={!!errors.MGM?.mgminstitution}
          />
          <MGMInputbox
            type="text"
            placeholder="계좌"
            register={register("MGM.mgmaccount")}
            isError={!!errors.MGM?.mgmaccount}
          />
        </div>

        {/* 7. 1차(직원) */}
        <h3>1차(직원)</h3>
        <div className={styles.mainbody}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>차순</div>
              <MGMInputbox
                type="text"
                placeholder="차순"
                defaultValue={watch("firstemp.firstemptimes") || ""}
                register={register("firstemp.firstemptimes")}
                isError={!!errors.firstemp?.firstemptimes}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>지급일</div>
              <div className={styles.dateInputContainer}>
                <MGMInputbox
                  type="date"
                  defaultValue={watch("firstemp.firstempdate") || ""}
                  register={register("firstemp.firstempdate")}
                  isError={!!errors.firstemp?.firstempdate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 8. 2차(직원) */}
        <h3>2차(직원)</h3>
        <div className={styles.mainbody}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>차순</div>
              <MGMInputbox
                type="text"
                placeholder="차순"
                defaultValue={watch("secondemp.secondemptimes") || ""}
                register={register("secondemp.secondemptimes")}
                isError={!!errors.secondemp?.secondemptimes}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>지급일</div>
              <div className={styles.dateInputContainer}>
                <MGMInputbox
                  type="date"
                  defaultValue={watch("secondemp.secondempdate") || ""}
                  register={register("secondemp.secondempdate")}
                  isError={!!errors.secondemp?.secondempdate}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 9. 총회참석여부 */}
        <h3>총회참석여부</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body3}>
              <MGMInputbox
                type="text"
                placeholder="서면"
                register={register("meetingattend.ftofattend")}
                isError={!!errors.meetingattend?.ftofattend}
              />
            </div>
            <div className={styles.content_body3}>
              <MGMInputbox
                type="text"
                placeholder="직접"
                register={register("meetingattend.selfattend")}
                isError={!!errors.meetingattend?.selfattend}
              />
            </div>
            <div className={styles.content_body3}>
              <MGMInputbox
                type="text"
                placeholder="대리"
                register={register("meetingattend.behalfattend")}
                isError={!!errors.meetingattend?.behalfattend}
              />
            </div>
          </div>
        </div>

        {/* 10. 안건 */}
        <h3>안건</h3>
        <div className={styles.mainbody}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제1호</div>
              <MGMInputbox
                type="text"
                placeholder="제1호"
                register={register("agenda.agenda1")}
                isError={!!errors.agenda?.agenda1}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제2-1호</div>
              <MGMInputbox
                type="text"
                placeholder="제2-1호"
                defaultValue={watch("agenda.agenda2_1") || ""}
                register={register("agenda.agenda2_1")}
                isError={!!errors.agenda?.agenda2_1}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제2-2호</div>
              <MGMInputbox
                type="text"
                placeholder="제2-2호"
                defaultValue={watch("agenda.agenda2_2") || ""}
                register={register("agenda.agenda2_2")}
                isError={!!errors.agenda?.agenda2_2}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제2-3호</div>
              <MGMInputbox
                type="text"
                placeholder="제2-3호"
                defaultValue={watch("agenda.agenda2_3") || ""}
                register={register("agenda.agenda2_3")}
                isError={!!errors.agenda?.agenda2_3}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제2-4호</div>
              <MGMInputbox
                type="text"
                placeholder="제2-4호"
                defaultValue={watch("agenda.agenda2_4") || ""}
                register={register("agenda.agenda2_4")}
                isError={!!errors.agenda?.agenda2_4}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제3호</div>
              <MGMInputbox
                type="text"
                placeholder="제3호"
                defaultValue={watch("agenda.agenda3") || ""}
                register={register("agenda.agenda3")}
                isError={!!errors.agenda?.agenda3}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제4호</div>
              <MGMInputbox
                type="text"
                placeholder="제4호"
                defaultValue={watch("agenda.agenda4") || ""}
                register={register("agenda.agenda4")}
                isError={!!errors.agenda?.agenda4}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제5호</div>
              <MGMInputbox
                type="text"
                placeholder="제5호"
                defaultValue={watch("agenda.agenda5") || ""}
                register={register("agenda.agenda5")}
                isError={!!errors.agenda?.agenda5}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제6호</div>
              <MGMInputbox
                type="text"
                placeholder="제6호"
                defaultValue={watch("agenda.agenda6") || ""}
                register={register("agenda.agenda6")}
                isError={!!errors.agenda?.agenda6}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제7호</div>
              <MGMInputbox
                type="text"
                placeholder="제7호"
                defaultValue={watch("agenda.agenda7") || ""}
                register={register("agenda.agenda7")}
                isError={!!errors.agenda?.agenda7}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제8호</div>
              <MGMInputbox
                type="text"
                placeholder="제8호"
                defaultValue={watch("agenda.agenda8") || ""}
                register={register("agenda.agenda8")}
                isError={!!errors.agenda?.agenda8}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제9호</div>
              <MGMInputbox
                type="text"
                defaultValue={watch("agenda.agenda9") || ""}
                register={register("agenda.agenda9")}
                isError={!!errors.agenda?.agenda9}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제10호</div>
              <MGMInputbox
                type="text"
                defaultValue={watch("agenda.agenda10") || "정보없음"}
                register={register("agenda.agenda10")}
                isError={!!errors.agenda?.agenda10}
              />
            </div>
          </div>
        </div>

        {/* 11. 비고 (additional) */}
        <h3>비고</h3>
        <div className={styles.content_container}>
          <InputAreabox
            type="text"
            placeholder="비고를 입력하세요"
            register={register("additional")}
            isError={!!errors.additional}
          />
        </div>

        <p></p>
        <Button_Y type="submit" disabled={idExists || checkingId}>
          저장하기
        </Button_Y>
      </form>
    </div>
  );
}

export default withAuth(Create);
