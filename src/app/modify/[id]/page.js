"use client";
import styles from "@/styles/Create.module.scss";
import Swal from "sweetalert2";
import {
  Inputbox,
  PostInputbox2,
  InputAreabox,
  DropInputbox,
  FileInputbox,
  Checkbox,
  MGMInputbox,
  MGMInputbox2,
} from "@/components/Inputbox";
import { Button_Y } from "@/components/Button";
import withAuth from "@/utils/hoc/withAuth";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  updateUser,
  fetchCustomerById,
  createFile,
  deleteFile,
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

function Modify({ params }) {
  const router = useRouter();
  const { id } = params;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [isupload, setIsupload] = useState({
    isuploaded: false,
    sealcertificateprovided: false,
    selfsignatureconfirmationprovided: false,
    commitmentletterprovided: false,
    idcopyprovided: false,
    freeoption: false,
    forfounding: false,
    agreement: false,
    preferenceattachment: false,
    prizeattachment: false,
    exemption7: false,
    investmentfile: false,
    contract: false,
  });
  const [file, setFile] = useState(null);
  const [existingFileInfo, setExistingFileInfo] = useState("");

  const [initialLegalPostNumber, setInitialLegalPostNumber] = useState("");
  const [initialLegalAddress, setInitialLegalAddress] = useState("");
  const [initialPostreceivePostNumber, setInitialPostreceivePostNumber] = useState("");
  const [initialPostreceiveAddress, setInitialPostreceiveAddress] = useState("");

  const [formattedRegisterPrice, setFormattedRegisterPrice] = useState("");
  const [formattedDepositAmmount, setFormattedDepositAmmount] = useState("");

  // 휴대폰 번호 화면 표시값 (기본 접두사 "010)" 제공)
  const [phoneDisplay, setPhoneDisplay] = useState("010)");

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

  // 휴대폰 번호 포맷팅 핸들러 (Modify 페이지)
  const handlePhoneNumberChange = (e, onChange) => {
    let value = e.target.value;
    if (value === "010)") {
      setPhoneDisplay("010)");
      onChange("");
      return;
    }
    if (value.startsWith("010)")) {
      value = value.slice(4);
    }
    let digits = value.replace(/\D/g, "");
    digits = digits.substring(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    }
    const displayValue = "010)" + formatted;
    setPhoneDisplay(displayValue);
    onChange(digits);
  };

  // 체크박스 변화
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIsupload((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 파일 업로드 변화
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

  useEffect(() => {
    const getData = async () => {
      try {
        const customer = await fetchCustomerById(id);
        console.log("받은 고객 데이터:", customer);
        if (customer) {
          setInitialLegalPostNumber(customer.legalAddress.postnumber || "");
          setInitialLegalAddress(customer.legalAddress.post || "");
          setInitialPostreceivePostNumber(customer.postreceive.postnumberreceive || "");
          setInitialPostreceiveAddress(customer.postreceive.postreceive || "");

          // reset 시 기존 값 불러오기 (해지/환불 정보는 빈 값으로 처리)
          reset({
            customertype: customer.customertype,
            registerpath: customer.registerpath,
            registerdate: customer.registerdate,
            registerprice: customer.registerprice,
            additional: customer.additional || "",
            prizewinning: customer.prizewinning,
            batch: customer.batch,
            type: customer.type,
            groupname: customer.groupname,
            turn: customer.turn,
            // 회원정보
            CustomerData: {
              name: customer.customerData.name,
              phone: customer.customerData.phone,
              resnumfront: customer.customerData.resnumfront,
              resnumback: customer.customerData.resnumback,
              email: customer.customerData.email,
            },
            // 주소
            LegalAddress: {
              postnumber: customer.legalAddress.postnumber,
              post: customer.legalAddress.post,
              detailaddress: customer.legalAddress.detailaddress,
            },
            Postreceive: {
              postnumberreceive: customer.postreceive.postnumberreceive,
              postreceive: customer.postreceive.postreceive,
              detailaddressreceive: customer.postreceive.detailaddressreceive,
            },
            // 금융정보
            Financial: {
              bankname: customer.financial.bankname,
              accountnum: customer.financial.accountnum,
              accountholder: customer.financial.accountholder,
              trustcompanydate: customer.financial.trustcompanydate,
            },
            // 예약금
            deposits: {
              depositdate: customer.deposits?.depositdate,
              depositammount: customer.deposits?.depositammount,
            },
            // 담당자
            responsible: {
              generalmanagement: customer.responsible?.generalmanagement || "",
              division: customer.responsible?.division || "",
              team: customer.responsible?.team || "",
              managername: customer.responsible?.managername || "",
            },
            // MGM, 다힘, 직원, 총회참석, 안건 등 나머지 값은 그대로 불러옴
            MGM: customer.mgm,
            dahim: customer.dahim,
            firstemp: customer.firstemp,
            secondemp: customer.secondemp,
            meetingattend: customer.meetingattend,
            agenda: customer.agenda,
            // 부속서류 (파일 관련 값은 따로 처리)
            exemption7: customer.attachments?.exemption7,
            investmentfile: customer.attachments?.investmentfile,
            contract: customer.attachments?.contract,
            agreement: customer.attachments?.agreement,
            preferenceattachment: customer.attachments?.preferenceattachment,
            prizeattachment: customer.attachments?.prizeattachment,
            sealcertificateprovided: customer.attachments?.sealcertificateprovided,
            selfsignatureconfirmationprovided: customer.attachments?.selfsignatureconfirmationprovided,
            commitmentletterprovided: customer.attachments?.commitmentletterprovided,
            idcopyprovided: customer.attachments?.idcopyprovided,
            freeoption: customer.attachments?.freeoption,
            forfounding: customer.attachments?.forfounding,
            prizename: customer.attachments?.prizename,
            prizedate: customer.attachments?.prizedate,
            // 해지/환불 정보는 불러오지 않고 빈 값으로 처리
            cancel: {
              canceldate: "",
              refunddate: "",
              refundamount: "",
            },
            cancelInfo: {
              reason: "",
              remarks: "",
              source: "",
            },
          });

          if (customer.registerprice) {
            setFormattedRegisterPrice(customer.registerprice.toLocaleString());
          }
          if (customer.deposits?.depositammount) {
            setFormattedDepositAmmount(customer.deposits.depositammount.toLocaleString());
          }
          if (customer.customerData && customer.customerData.phone) {
            const digits = customer.customerData.phone;
            let formatted = digits;
            if (digits.length > 4) {
              formatted = digits.slice(0, 4) + "-" + digits.slice(4);
            }
            setPhoneDisplay("010)" + formatted);
          }
          if (customer.attachments && customer.attachments.fileinfo) {
            setExistingFileInfo(customer.attachments.fileinfo);
          }
        }
      } catch (error) {
        console.error("고객 정보를 가져오는데 실패했습니다:", error);
      }
    };
    getData();
  }, [id, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      // cancelInfo는 새로 입력받도록 유지
      const parsedData = {
        ...data,
        CustomerData: {
          ...data.CustomerData,
          resnumfront: parseInt(data.CustomerData.resnumfront),
          resnumback: parseInt(data.CustomerData.resnumback),
        },
        registerprice: parseInt(data.registerprice),
        deposits: {
          ...data.deposits,
          depositammount: parseInt(data.deposits.depositammount),
        },
      };

      let uploadedFileInfo = existingFileInfo;
      if (file) {
        if (existingFileInfo) {
          await deleteFile(existingFileInfo);
        }
        const uploadResponse = await createFile(file, parseInt(id, 10));
        uploadedFileInfo = uploadResponse.data;
      }

      const attachments = {
        ...isupload,
        fileinfo: uploadedFileInfo,
        prizename: data.prizename,
        prizedate: data.prizedate,
      };

      const customerData = {
        id: parseInt(id),
        customertype: parsedData.customertype,
        registerpath: parsedData.registerpath,
        registerdate: parsedData.registerdate,
        registerprice: parsedData.registerprice,
        additional: parsedData.additional,
        prizewinning: parsedData.prizewinning,
        batch: parsedData.batch,
        type: parsedData.type,
        groupname: parsedData.groupname,
        turn: parsedData.turn,
        CustomerData: parsedData.CustomerData,
        Financial: parsedData.Financial,
        LegalAddress: { ...parsedData.LegalAddress },
        Postreceive: { ...parsedData.Postreceive },
        deposits: parsedData.deposits,
        attachments: attachments,
        dahim: parsedData.dahim,
        firstemp: parsedData.firstemp,
        secondemp: parsedData.secondemp,
        meetingattend: parsedData.meetingattend,
        agenda: parsedData.agenda,
        cancel: parsedData.cancel,
        cancelInfo: parsedData.cancelInfo,
        MGM: parsedData.MGM,
        responsible: parsedData.responsible,
      };

      console.log("수정할 데이터:", customerData);
      const updateUserResponse = await updateUser(id, customerData);

      Swal.fire({
        icon: "success",
        title: "회원정보가 수정되었습니다.",
        text:
          "관리번호 : " +
          updateUserResponse.id +
          "/ 회원명 : " +
          parsedData.CustomerData.name,
      });

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
        agreement: false,
        preferenceattachment: false,
        prizeattachment: false,
        exemption7: false,
        investmentfile: false,
        contract: false,
      });
      setFormattedRegisterPrice("");
      setFormattedDepositAmmount("");
      setPhoneDisplay("010)");
      window.scrollTo(0, 0);
      router.push(`/search/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "회원정보 수정 실패",
        text: "회원 정보를 수정하는 동안 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  const prizeattachmentChecked = watch("prizeattachment", false);
  const customerType = watch("customertype");

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {/* 회원 정보 수정 */}
        <h3>회원 정보 수정</h3>
        <div className={styles.content_container}>
          <div className={styles.Font}>관리번호 : {id}</div>
          <h1></h1>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이름 *</div>
            <Inputbox
              type="text"
              register={register("CustomerData.name", {
                required: "이름을 입력해주세요.",
              })}
              isError={!!errors.CustomerData?.name}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>휴대폰 번호 *</div>
            <Controller
              name="CustomerData.phone"
              control={control}
              defaultValue=""
              rules={{ required: "휴대폰 번호를 입력해주세요." }}
              render={({ field: { onChange } }) => (
                <Inputbox
                  type="tel"
                  placeholder="휴대폰 번호 *"
                  value={phoneDisplay}
                  onChange={(e) => handlePhoneNumberChange(e, onChange)}
                  isError={!!errors.CustomerData?.phone}
                />
              )}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>주민번호 앞자리 *</div>
            <Inputbox
              type="number"
              register={register("CustomerData.resnumfront", {
                required: "주민번호 앞자리를 입력해주세요.",
              })}
              isError={!!errors.CustomerData?.resnumfront}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>주민번호 뒷자리 *</div>
            <Inputbox
              type="number"
              register={register("CustomerData.resnumback", {
                required: "주민번호 뒷자리를 입력해주세요.",
              })}
              isError={!!errors.CustomerData?.resnumback}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이메일</div>
            <Inputbox
              type="email"
              register={register("CustomerData.email", {})}
              isError={!!errors.CustomerData?.email}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>분류 *</div>
            <DropInputbox
              list={classificationlist}
              register={register("customertype", {
                required: "분류를 선택해주세요.",
              })}
              isError={!!errors.customertype}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>가입경로</div>
            <Inputbox
              type="text"
              register={register("registerpath", {})}
              isError={!!errors.registerpath}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>은행 *</div>
            <DropInputbox
              list={banklist}
              register={register("Financial.bankname", {
                required: "은행을 선택해주세요.",
              })}
              isError={!!errors.Financial?.bankname}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>계좌번호 *</div>
            <Inputbox
              type="text"
              register={register("Financial.accountnum", {
                required: "계좌번호를 입력해주세요.",
              })}
              isError={!!errors.Financial?.accountnum}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>예금주 *</div>
            <Inputbox
              type="text"
              register={register("Financial.accountholder", {
                required: "예금주를 입력해주세요.",
              })}
              isError={!!errors.Financial?.accountholder}
            />
          </div>

        {/* 주소 */}
        <div className={styles.InputboxField}>
          <div className={styles.InputFont}>법정주소 *</div>
          <PostInputbox2
            register={register}
            setValue={setValue}
            namePrefix="LegalAddress"
            postcodeName="LegalAddress.postnumber"
            addressName="LegalAddress.post"
            initialPostNumber={initialLegalPostNumber}
            initialAddress={initialLegalAddress}
            isError={
              !!errors.LegalAddress?.postnumber ||
              !!errors.LegalAddress?.post ||
              !!errors.LegalAddress?.detailaddress
            }
          />
          <div className={styles.inputRow}>
            <Inputbox
              type="text"
              register={register("LegalAddress.detailaddress", {
                required: "법정주소를 입력해주세요.",
              })}
              isError={!!errors.LegalAddress?.detailaddress}
            />
          </div>
        </div>
        <div className={styles.InputboxField}>
          <div className={styles.InputFont}>우편물 주소지 *</div>
          <PostInputbox2
            register={register}
            setValue={setValue}
            namePrefix="Postreceive"
            postcodeName="Postreceive.postnumberreceive"
            addressName="Postreceive.postreceive"
            initialPostNumber={initialPostreceivePostNumber}
            initialAddress={initialPostreceiveAddress}
            isError={
              !!errors.Postreceive?.postnumberreceive ||
              !!errors.Postreceive?.postreceive ||
              !!errors.Postreceive?.detailaddressreceive
            }
          />
          <div className={styles.inputRow}>
            <Inputbox
              type="text"
              register={register("Postreceive.detailaddressreceive", {
                required: "우편물 주소지를 입력해주세요.",
              })}
              isError={!!errors.Postreceive?.detailaddressreceive}
            />
          </div>
        </div>
        
        </div>

        {/* 관리정보 섹션 */}
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

          {/* 가입일자 및 가입가 */}
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
              <div className={styles.dateInputContainer}>

              <div className={styles.inputColumnLabel}>가입가 *</div>
                <Inputbox
                  type="text"
                  placeholder="가입가 *"
                  value={formattedRegisterPrice}
                  onChange={handleRegisterPriceChange}
                  isError={!!errors.registerprice}
                />
              </div>
              </div>
            </div>
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
                
              <div className={styles.dateInputContainer}>

<div className={styles.inputColumnLabel}>예약금 *</div>
                <Inputbox
                  type="text"
                  placeholder="예약금 *"
                  value={formattedDepositAmmount}
                  onChange={handleDepositAmmountChange}
                  isError={!!errors.deposits?.depositammount}
                />
              </div>
              </div>
            </div>
            <div className={styles.content_body2}>
              <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>신탁사 제출일자 *</label>
                <Inputbox
                  type="date"
                  register={register("Financial.trustcompanydate", {
                    required: "신탁사 제출일자를 입력해주세요.",
                  })}
                  isError={!!errors.Financial?.trustcompanydate}
                />
              </div>
            </div>

          {/* 추가 체크박스: 7차 면제, 출자금, 지산A동 계약서 및 경품 당첨 입력필드 */}
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
            <div className={styles.content_body3}>
              <MGMInputbox2
                type="text"
                placeholder="경품 당첨"
                register={register("prizewinning")}
                isError={!!errors.prizewinning}
              />
            </div>
          </div>
        </div>
        </div>

        {/* 부속서류 */}
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
              name="agreement"
              onChange={handleCheckboxChange}
              register={register("agreement")}
              isError={!!errors.agreement}
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

        {/* 파일 업로드 */}
        <div className={styles.content_container}>
          <div>
            <span>파일업로드</span>
            <FileInputbox
              name="fileupload"
              handleChange={handleFileChange}
              register={register("fileupload")}
              isupload={isupload.isuploaded}
              value={file ? file.name : existingFileInfo}
              isError={!!errors.fileupload}
            />
          </div>
        </div>

        {/* 해지/환불 정보 (회원 분류가 "x"일 때 렌더링) */}
        {customerType?.toLowerCase() === "x" && (
          <>
            <h3>해지/환불 정보</h3>
            <div className={styles.content_container}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>해지일자 *</div>
                <Inputbox
                  type="date"
                  register={register("cancel.canceldate", {
                    required: "해지일자를 입력해주세요.",
                  })}
                  isError={!!errors.cancel?.canceldate}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>환급일자 *</div>
                <Inputbox
                  type="date"
                  register={register("cancel.refunddate", {
                    required: "환급일자를 입력해주세요.",
                  })}
                  isError={!!errors.cancel?.refunddate}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>환급액 *</div>
                <Inputbox
                  type="number"
                  register={register("cancel.refundamount", {
                    required: "환급액을 입력해주세요.",
                  })}
                  isError={!!errors.cancel?.refundamount}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>사유 *</div>
                <Inputbox
                  type="text"
                  register={register("cancelInfo.reason", {
                    required: "해지 사유를 입력해주세요.",
                  })}
                  isError={!!errors.cancelInfo?.reason}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>출처 *</div>
                <Inputbox
                  type="text"
                  register={register("cancelInfo.source", {
                    required: "출처를 입력해주세요.",
                  })}
                  isError={!!errors.cancelInfo?.source}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>비고</div>
                <Inputbox
                  type="text"
                  register={register("cancelInfo.remarks")}
                  isError={!!errors.cancelInfo?.remarks}
                />
              </div>
            </div>
          </>
        )}

        {/* 다힘 */}
        <h3>다힘</h3>
        <div className={styles.mainbody}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>시상</div>
              <MGMInputbox
                type="text"
                placeholder="시상"
                defaultValue={watch("dahim.dahimsisang") || ""}
                register={register("dahim.dahimsisang")}
                isError={!!errors.dahim?.dahimsisang}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>일자</div>
              <MGMInputbox
                type="date"
                defaultValue={watch("dahim.dahimdate") || ""}
                register={register("dahim.dahimdate")}
                isError={!!errors.dahim?.dahimdate}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>6/30선지급</div>
              <MGMInputbox
                type="text"
                placeholder="6/30선지급"
                defaultValue={watch("dahim.dahimprepaid") || ""}
                register={register("dahim.dahimprepaid")}
                isError={!!errors.dahim?.dahimprepaid}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>1회차청구</div>
              <MGMInputbox
                type="text"
                placeholder="1회차청구"
                defaultValue={watch("dahim.dahimfirst") || ""}
                register={register("dahim.dahimfirst")}
                isError={!!errors.dahim?.dahimfirst}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>금액(만원)</div>
              <MGMInputbox
                type="text"
                placeholder="금액(만원)"
                defaultValue={watch("dahim.dahimfirstpay") || ""}
                register={register("dahim.dahimfirstpay")}
                isError={!!errors.dahim?.dahimfirstpay}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>일자</div>
              <MGMInputbox
                type="date"
                defaultValue={watch("dahim.dahimdate2") || ""}
                register={register("dahim.dahimdate2")}
                isError={!!errors.dahim?.dahimdate2}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>2회차청구</div>
              <MGMInputbox
                type="text"
                placeholder="2회차청구"
                defaultValue={watch("dahim.dahimsecond") || ""}
                register={register("dahim.dahimsecond")}
                isError={!!errors.dahim?.dahimsecond}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>금액</div>
              <MGMInputbox
                type="text"
                placeholder="금액"
                defaultValue={watch("dahim.dahimsecondpay") || ""}
                register={register("dahim.dahimsecondpay")}
                isError={!!errors.dahim?.dahimsecondpay}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>일자</div>
              <MGMInputbox
                type="date"
                defaultValue={watch("dahim.dahimdate3") || ""}
                register={register("dahim.dahimdate3")}
                isError={!!errors.dahim?.dahimdate3}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>합계</div>
              <MGMInputbox
                type="text"
                placeholder="합계"
                defaultValue={watch("dahim.dahimsum") || ""}
                register={register("dahim.dahimsum")}
                isError={!!errors.dahim?.dahimsum}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>출처</div>
              <MGMInputbox
                type="text"
                placeholder="출처"
                defaultValue={watch("dahim.dahimsource") || ""}
                register={register("dahim.dahimsource")}
                isError={!!errors.dahim?.dahimsource}
              />
            </div>
          </div>
        </div>

        {/* 담당자 */}
        <h3>담당자</h3>
        <div className={`${styles.content_container} ${styles.responsibleContainer}`}>
          <div className={styles.responsibleRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>총괄 *</div>
              <MGMInputbox
                type="text"
                register={register("responsible.generalmanagement", {
                  required: "총괄을 입력해주세요.",
                })}
                isError={!!errors.responsible?.generalmanagement}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>본부 *</div>
              <MGMInputbox
                type="text"
                register={register("responsible.division", {
                  required: "본부를 입력해주세요.",
                })}
                isError={!!errors.responsible?.division}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>팀 *</div>
              <MGMInputbox
                type="text"
                register={register("responsible.team", {
                  required: "팀을 입력해주세요.",
                })}
                isError={!!errors.responsible?.team}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>성명 *</div>
              <MGMInputbox
                type="text"
                register={register("responsible.managername", {
                  required: "성명을 입력해주세요.",
                })}
                isError={!!errors.responsible?.managername}
              />
            </div>
          </div>
        </div>

        {/* MGM */}
        <h3>MGM</h3>
        <div className={`${styles.content_container} ${styles.mgmContainer}`}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>업체명</div>
              <MGMInputbox
                type="text"
                register={register("MGM.mgmcompanyname")}
                isError={!!errors.MGM?.mgmcompanyname}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>이름</div>
              <MGMInputbox
                type="text"
                register={register("MGM.mgmname")}
                isError={!!errors.MGM?.mgmname}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>은행명</div>
              <MGMInputbox
                type="text"
                register={register("MGM.mgminstitution")}
                isError={!!errors.MGM?.mgminstitution}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>계좌</div>
              <MGMInputbox
                type="text"
                register={register("MGM.mgmaccount")}
                isError={!!errors.MGM?.mgmaccount}
              />
            </div>
          </div>
        </div>

        {/* 1차(직원) */}
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

        {/* 2차(직원) */}
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

        {/* 비고 */}
        <h3>비고</h3>
        <div className={styles.content_container}>
          <div className={styles.inputRow}>
            <InputAreabox
              type="text"
              register={register("additional")}
              isError={!!errors.additional}
            />
          </div>
        </div>

        {/* 총회참석여부 */}
        <h3>총회참석여부</h3>
        <div className={styles.mainbody}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>서면</div>
              <Inputbox
                type="text"
                placeholder="서면"
                defaultValue={watch("meetingattend.ftofattend") || ""}
                register={register("meetingattend.ftofattend")}
                isError={!!errors.meetingattend?.ftofattend}
              />
            </div>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>직접</div>
              <Inputbox
                type="text"
                placeholder="직접"
                defaultValue={watch("meetingattend.selfattend") || ""}
                register={register("meetingattend.selfattend")}
                isError={!!errors.meetingattend?.selfattend}
              />
            </div>
          </div>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>대리</div>
              <Inputbox
                type="text"
                placeholder="대리"
                defaultValue={watch("meetingattend.behalfattend") || ""}
                register={register("meetingattend.behalfattend")}
                isError={!!errors.meetingattend?.behalfattend}
              />
            </div>
          </div>
        </div>

        {/* 안건 */}
        <h3>안건</h3>
        <div className={styles.mainbody}>
          <div className={styles.mgmRow}>
            <div className={styles.inputColumnRow}>
              <div className={styles.inputColumnLabel}>제1호</div>
              <MGMInputbox
                type="text"
                placeholder="제1호"
                defaultValue={watch("agenda.agenda1") || ""}
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

        <Button_Y type="submit">수정하기</Button_Y>
      </form>
    </div>
  );
}

export default withAuth(Modify);
