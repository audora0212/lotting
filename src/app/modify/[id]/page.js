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
  MGMInputbox
} from "@/components/Inputbox";
import { Button_Y } from "@/components/Button";
import withAuth from "@/utils/hoc/withAuth";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { updateUser, fetchCustomerById, createFile, deleteFile } from "@/utils/api";
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

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

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
    setValue("Deposit.depositammount", rawValue ? parseInt(rawValue, 10) : null);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const customer = await fetchCustomerById(id);
        if (customer) {
          setInitialLegalPostNumber(customer.legalAddress.postnumber || "");
          setInitialLegalAddress(customer.legalAddress.post || "");
          setInitialPostreceivePostNumber(customer.postreceive.postnumberreceive || "");
          setInitialPostreceiveAddress(customer.postreceive.postreceive || "");

          reset({
            customertype: customer.customertype,
            type: customer.type,
            groupname: customer.groupname,
            turn: customer.turn,
            batch: customer.batch,
            registerdate: customer.registerdate,
            registerprice: customer.registerprice,
            registerpath: customer.registerpath,
            specialnote: customer.specialnote,
            CustomerData: {
              name: customer.customerData.name,
              phone: customer.customerData.phone,
              resnumfront: customer.customerData.resnumfront,
              resnumback: customer.customerData.resnumback,
              email: customer.customerData.email,
            },
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
            Financial: {
              bankname: customer.financial.bankname,
              accountnum: customer.financial.accountnum,
              accountholder: customer.financial.accountholder,
            },
            Deposit: {
              depositdate: customer.deposits.depositdate,
              depositammount: customer.deposits.depositammount,
            },
            Responsible: {
              generalmanagement: customer.responsible.generalmanagement,
              division: customer.responsible.division,
              team: customer.responsible.team,
              managername: customer.responsible.managername,
            },
            MGM: {
              mgmcompanyname: customer.mgm.mgmcompanyname,
              mgmname: customer.mgm.mgmname,
              mgminstitution: customer.mgm.mgminstitution,
              mgmaccount: customer.mgm.mgmaccount,
            },
            prizename: customer.prizename || "",
            prizedate: customer.prizedate || "",
          });

          setIsupload({
            isuploaded: customer.attachments.isuploaded,
            sealcertificateprovided: customer.attachments.sealcertificateprovided,
            selfsignatureconfirmationprovided: customer.attachments.selfsignatureconfirmationprovided,
            commitmentletterprovided: customer.attachments.commitmentletterprovided,
            idcopyprovided: customer.attachments.idcopyprovided,
            freeoption: customer.attachments.freeoption,
            forfounding: customer.attachments.forfounding,
            agreement: customer.attachments.agreement,
            preferenceattachment: customer.attachments.preferenceattachment,
            prizeattachment: customer.attachments.prizeattachment,
            exemption7: customer.attachments.exemption7,
            investmentfile: customer.attachments.investmentfile,
            contract: customer.attachments.contract,
          });

          setExistingFileInfo(customer.attachments.fileinfo || "");

          if (customer.registerprice) {
            setFormattedRegisterPrice(customer.registerprice.toLocaleString());
          }
          if (customer.deposits.depositammount) {
            setFormattedDepositAmmount(customer.deposits.depositammount.toLocaleString());
          }
        }
      } catch (error) {
        console.error("고객 정보를 가져오는데 실패했습니다:", error);
      }
    };
    getData();
  }, [id, reset]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setIsupload((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
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
        } else if (typeof errors[field] === 'object' && errors[field] !== null) {
          for (const subField in errors[field]) {
            if (errors[field].hasOwnProperty(subField) && errors[field][subField].message) {
              errorMessages.push(errors[field][subField].message);
            }
          }
        }
      }
    }

    const errorMessage = errorMessages.join('\n');

    Swal.fire({
      icon: 'warning',
      title: '필수 항목 누락',
      text: errorMessage,
    });
  };

  const onSubmit = async (data) => {
    try {
      const parsedData = {
        ...data,
        CustomerData: {
          ...data.CustomerData,
          resnumfront: parseInt(data.CustomerData.resnumfront),
          resnumback: parseInt(data.CustomerData.resnumback),
        },
        registerprice: parseInt(data.registerprice),
        Deposit: {
          ...data.Deposit,
          depositdate: data.Deposit.depositdate,
          depositammount: parseInt(data.Deposit.depositammount),
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
      };

      const customerData = {
        id: parseInt(id),
        customertype: parsedData.customertype,
        registerpath: parsedData.registerpath,
        type: parsedData.type,
        groupname: parsedData.groupname,
        turn: parsedData.turn,
        batch: parsedData.batch,
        registerdate: parsedData.registerdate,
        registerprice: parsedData.registerprice,
        CustomerData: parsedData.CustomerData,
        Financial: parsedData.Financial,
        LegalAddress: {
          ...parsedData.LegalAddress,
        },
        Postreceive: {
          ...parsedData.Postreceive,
        },
        MGM: parsedData.MGM,
        Responsible: parsedData.Responsible,
        deposits: parsedData.Deposit,
        attachments: attachments,
        exemption7: parsedData.exemption7,
        investmentfile: parsedData.investmentfile,
        contract: parsedData.contract,
        agreement: parsedData.agreement,
        preferenceattachment: parsedData.preferenceattachment,
        prizeattachment: parsedData.prizeattachment,
        sealcertificateprovided: parsedData.sealcertificateprovided,
        selfsignatureconfirmationprovided: parsedData.selfsignatureconfirmationprovided,
        commitmentletterprovided: parsedData.commitmentletterprovided,
        idcopyprovided: parsedData.idcopyprovided,
        freeoption: parsedData.freeoption,
        forfounding: parsedData.forfounding,
        specialnote: parsedData.specialnote,
        prizename: parsedData.prizename || "",
        prizedate: parsedData.prizedate || "",
      };

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
      window.scrollTo(0, 0);
      router.push(`/search/${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "회원정보 수정 실패",
        text:
          "회원 정보를 수정하는 동안 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  const prizeattachmentChecked = watch("prizeattachment", false);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <h3>회원 정보 수정</h3>
        <div className={styles.content_container}>
          <div className={styles.Font}>관리번호 : {id}</div>
          <h1></h1>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이름 *</div>
            <Inputbox
              type="text"
              register={register("CustomerData.name", { required: "이름을 입력해주세요." })}
              isError={!!errors.CustomerData?.name}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>휴대폰 번호 *</div>
            <Inputbox
              type="phone"
              register={register("CustomerData.phone", { required: "휴대폰 번호를 입력해주세요." })}
              isError={!!errors.CustomerData?.phone}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>주민번호 앞자리 *</div>
            <Inputbox
              type="number"
              register={register("CustomerData.resnumfront", { required: "주민번호 앞자리를 입력해주세요." })}
              isError={!!errors.CustomerData?.resnumfront}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>주민번호 뒷자리 *</div>
            <Inputbox
              type="number"
              register={register("CustomerData.resnumback", { required: "주민번호 뒷자리를 입력해주세요." })}
              isError={!!errors.CustomerData?.resnumback}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이메일 *</div>
            <Inputbox
              type="email"
              register={register("CustomerData.email", { required: "이메일을 입력해주세요." })}
              isError={!!errors.CustomerData?.email}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>분류 *</div>
            <DropInputbox
              list={classificationlist}
              register={register("customertype", { required: "분류를 선택해주세요." })}
              isError={!!errors.customertype}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>가입경로 *</div>
            <Inputbox
              type="text"
              register={register("registerpath", { required: "가입경로를 입력해주세요." })}
              isError={!!errors.registerpath}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>은행 *</div>
            <DropInputbox
              list={banklist}
              register={register("Financial.bankname", { required: "은행을 선택해주세요." })}
              isError={!!errors.Financial?.bankname}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>계좌번호 *</div>
            <Inputbox
              type="text"
              register={register("Financial.accountnum", { required: "계좌번호를 입력해주세요." })}
              isError={!!errors.Financial?.accountnum}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>예금주 *</div>
            <Inputbox
              type="text"
              register={register("Financial.accountholder", { required: "예금주를 입력해주세요." })}
              isError={!!errors.Financial?.accountholder}
            />
          </div>
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
              isError={!!errors.LegalAddress?.postnumber || !!errors.LegalAddress?.post || !!errors.LegalAddress?.detailaddress}
            />
            <div className={styles.inputRow}>
              <div className={styles.inputLabel}>법정주소 상세 *</div>
              <Inputbox
                type="text"
                register={register("LegalAddress.detailaddress", { required: "법정주소를 입력해주세요." })}
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
              isError={!!errors.Postreceive?.postnumberreceive || !!errors.Postreceive?.postreceive || !!errors.Postreceive?.detailaddressreceive}
            />
            <div className={styles.inputRow}>
              <div className={styles.inputLabel}>우편물 주소지 상세 *</div>
              <Inputbox
                type="text"
                register={register("Postreceive.detailaddressreceive", { required: "우편물 주소지를 입력해주세요." })}
                isError={!!errors.Postreceive?.detailaddressreceive}
              />
            </div>
          </div>
        </div>

        <h3>관리 정보</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>제출 순번 *</div>
                <DropInputbox
                  list={typeidlist}
                  register={register("batch", { required: "제출 순번을 선택해주세요." })}
                  isError={!!errors.batch}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>유형 *</div>
                <DropInputbox
                  list={typelist}
                  register={register("type", { required: "유형을 선택해주세요." })}
                  isError={!!errors.type}
                />
              </div>
            </div>
            <div className={styles.content_body2}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>그룹 *</div>
                <DropInputbox
                  list={grouplist}
                  register={register("groupname", { required: "그룹을 선택해주세요." })}
                  isError={!!errors.groupname}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>순번 *</div>
                <DropInputbox
                  list={turnlist}
                  register={register("turn", { required: "순번을 선택해주세요." })}
                  isError={!!errors.turn}
                />
              </div>
            </div>
          </div>

          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>가입일자 *</div>
                <Inputbox
                  type="date"
                  register={register("registerdate", { required: "가입일자를 입력해주세요." })}
                  isError={!!errors.registerdate}
                />
              </div>
            </div>
            <div className={styles.content_body2}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>가입가 *</div>
                <Inputbox
                  type="text"
                  value={formattedRegisterPrice}
                  onChange={handleRegisterPriceChange}
                  isError={!!errors.registerprice}
                />
              </div>
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>예약금 납입일자 *</div>
                <Inputbox
                  type="date"
                  register={register("Deposit.depositdate", { required: "예약금 납입일자를 입력해주세요." })}
                  isError={!!errors.Deposit?.depositdate}
                />
              </div>
            </div>
            <div className={styles.content_body2}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>예약금 *</div>
                <Inputbox
                  type="text"
                  value={formattedDepositAmmount}
                  onChange={handleDepositAmmountChange}
                  isError={!!errors.Deposit?.depositammount}
                />
              </div>
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body3}>
              <Checkbox
                label="7차 면제"
                name="exemption7"
                checked={isupload.exemption7}
                onChange={handleCheckboxChange}
                register={register("exemption7")}
                isError={!!errors.exemption7}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="출자금"
                name="investmentfile"
                checked={isupload.investmentfile}
                onChange={handleCheckboxChange}
                register={register("investmentfile")}
                isError={!!errors.investmentfile}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="지산A동 계약서"
                name="contract"
                checked={isupload.contract}
                onChange={handleCheckboxChange}
                register={register("contract")}
                isError={!!errors.contract}
              />
            </div>
          </div>
        </div>

        <h3>MGM</h3>
        <div className={`${styles.content_container} ${styles.mgmContainer}`}>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>업체명 *</div>
            <MGMInputbox
              type="text"
              register={register("MGM.mgmcompanyname", { required: "업체명을 입력해주세요." })}
              isError={!!errors.MGM?.mgmcompanyname}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>이름 *</div>
            <MGMInputbox
              type="text"
              register={register("MGM.mgmname", { required: "이름을 입력해주세요." })}
              isError={!!errors.MGM?.mgmname}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>기관 *</div>
            <MGMInputbox
              type="text"
              register={register("MGM.mgminstitution", { required: "기관을 입력해주세요." })}
              isError={!!errors.MGM?.mgminstitution}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>계좌 *</div>
            <MGMInputbox
              type="text"
              register={register("MGM.mgmaccount", { required: "계좌를 입력해주세요." })}
              isError={!!errors.MGM?.mgmaccount}
            />
          </div>
        </div>

        <h3>부속서류</h3>
        
        <div className={styles.attachmentContainer}>
          <div className={styles.attachmentGrid}>
            <Checkbox
              label="인감증명서"
              name="sealcertificateprovided"
              checked={isupload.sealcertificateprovided}
              onChange={handleCheckboxChange}
              register={register("sealcertificateprovided")}
              isError={!!errors.sealcertificateprovided}
            />
            <Checkbox
              label="본인서명확인서"
              name="selfsignatureconfirmationprovided"
              checked={isupload.selfsignatureconfirmationprovided}
              onChange={handleCheckboxChange}
              register={register("selfsignatureconfirmationprovided")}
              isError={!!errors.selfsignatureconfirmationprovided}
            />
            <Checkbox
              label="확약서"
              name="commitmentletterprovided"
              checked={isupload.commitmentletterprovided}
              onChange={handleCheckboxChange}
              register={register("commitmentletterprovided")}
              isError={!!errors.commitmentletterprovided}
            />
            <Checkbox
              label="신분증"
              name="idcopyprovided"
              checked={isupload.idcopyprovided}
              onChange={handleCheckboxChange}
              register={register("idcopyprovided")}
              isError={!!errors.idcopyprovided}
            />
            <Checkbox
              label="무상옵션"
              name="freeoption"
              checked={isupload.freeoption}
              onChange={handleCheckboxChange}
              register={register("freeoption")}
              isError={!!errors.freeoption}
            />
            <Checkbox
              label="창준위용"
              name="forfounding"
              checked={isupload.forfounding}
              onChange={handleCheckboxChange}
              register={register("forfounding")}
              isError={!!errors.forfounding}
            />
            <Checkbox
              label="총회동의서"
              name="agreement"
              checked={isupload.agreement}
              onChange={handleCheckboxChange}
              register={register("agreement")}
              isError={!!errors.agreement}
            />
            <Checkbox
              label="선호도조사"
              name="preferenceattachment"
              checked={isupload.preferenceattachment}
              onChange={handleCheckboxChange}
              register={register("preferenceattachment")}
              isError={!!errors.preferenceattachment}
            />
            <Checkbox
              label="사은품"
              name="prizeattachment"
              checked={isupload.prizeattachment}
              onChange={handleCheckboxChange}
              register={register("prizeattachment")}
              isError={!!errors.prizeattachment}
            />
          </div>
          
          {prizeattachmentChecked && (
            <div className={styles.prizeRow}>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>사은품명</div>
                <Inputbox
                  type="text"
                  register={register("prizename")}
                  isError={!!errors.prizename}
                />
              </div>
              <div className={styles.inputRow}>
                <div className={styles.inputLabel}>지급일자</div>
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
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>파일업로드</div>
            <FileInputbox
              name="fileupload"
              handleChange={handleFileChange}
              register={register("fileupload")}
              isupload={isupload.isuploaded}
              value={file ? file.name : ""}
              isError={!!errors.fileupload}
            />
          </div>
          {existingFileInfo && (
            <div className={styles.existingFile}>
              기존 파일: {existingFileInfo}
            </div>
          )}
        </div>

        <h3>담당자 정보</h3>
        <div className={`${styles.content_container} ${styles.responsibleContainer}`}>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>총괄 *</div>
            <Inputbox
              type="text"
              register={register("Responsible.generalmanagement", { required: "총괄을 입력해주세요." })}
              isError={!!errors.Responsible?.generalmanagement}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>본부 *</div>
            <Inputbox
              type="text"
              register={register("Responsible.division", { required: "본부를 입력해주세요." })}
              isError={!!errors.Responsible?.division}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>팀 *</div>
            <Inputbox
              type="text"
              register={register("Responsible.team", { required: "팀을 입력해주세요." })}
              isError={!!errors.Responsible?.team}
            />
          </div>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>성명 *</div>
            <Inputbox
              type="text"
              register={register("Responsible.managername", { required: "성명을 입력해주세요." })}
              isError={!!errors.Responsible?.managername}
            />
          </div>
        </div>

        <h3>비고</h3>
        <div className={styles.content_container}>
          <div className={styles.inputRow}>
            <div className={styles.inputLabel}>비고</div>
            <InputAreabox
              type="text"
              register={register("specialnote")}
              isError={!!errors.specialnote}
            />
          </div>
        </div>
        <h1></h1>
        <Button_Y type="submit">수정하기</Button_Y>
        <h1></h1>
      </form>
    </div>
  );
}

export default withAuth(Modify);
