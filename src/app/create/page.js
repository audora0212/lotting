// src/app/create/page.js

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
} from "@/components/Inputbox";
import { Button_Y } from "@/components/Button";
import withAuth from "@/utils/hoc/withAuth";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { createFile, newIdGenerate, createUser } from "@/utils/api";
import { useRouter } from "next/navigation";

import {
  banklist,
  sintacklist,
  classificationlist,
  typeidlist,
  typelist,
  grouplist,
  turnlist,
  sortlist,
} from "@/components/droplistdata";

function Create() {
  const router = useRouter();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const [newid, setNewid] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const nextId = await newIdGenerate();
        setNewid(nextId);
      } catch (error) {
        console.error("관리번호를 가져오는데 실패했습니다:", error);
      }
    };
    getData();
  }, []);

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setIsupload((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFileChange = (e) => {
    console.log("file changing");
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      console.log("선택된 파일:", selectedFile);
      const extension = selectedFile.name.split(".").pop();
      const renamedFile = new File(
        [selectedFile],
        `${newid}_${name}.${extension}`,
        { type: selectedFile.type }
      );
      setFile(renamedFile);
      setIsupload((prev) => ({
        ...prev,
        [name]: true,
        isuploaded: true,
      }));
    }
  };

  // onError 핸들러
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

  // onSubmit 핸들러
  const onSubmit = async (data) => { 
    console.log("onSubmit 호출됨", data);
    try {
      console.log("폼 제출 데이터:", data);
      console.log("Parsed depositdate:", data.Deposit.depositdate);
      
      // 파일 업로드
      let uploadedFileInfo = "";
      if (file) {
        console.log("업로드할 파일:", file);
        const uploadResponse = await createFile(file);
        console.log("파일 업로드 응답:", uploadResponse);
        uploadedFileInfo = uploadResponse.data;
      }

      // 데이터 파싱 및 정리
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

      // Attachments 정보 추가
      const attachments = {
        ...isupload,
        fileinfo: uploadedFileInfo,
      };

      // 최종 고객 데이터 구성
      const customerData = {
        customertype: data.customertype,
        registerpath: data.registerpath,
        type: data.type,
        groupname: data.groupname,
        turn: data.turn,
        batch: data.batch,
        registerdate: parsedData.registerdate,
        registerprice: parsedData.registerprice,
        CustomerData: parsedData.CustomerData,
        Financial: parsedData.Financial,
        LegalAddress: {
          ...parsedData.LegalAddress,
          postcode: data.LegalAddress.postnumber,
          address: data.LegalAddress.post,
        },
        Postreceive: {
          ...parsedData.Postreceive,
          postcode: data.Postreceive.postnumberreceive,
          address: data.Postreceive.postreceive, // 커스텀 필드 이름 사용
        },
        MGM: data.MGM,
        Responsible: data.Responsible,
        deposits: parsedData.Deposit,
        attachments: attachments,
        exemption7: data.exemption7,
        investmentfile: data.investmentfile,
        contract: data.contract,
        agreement: data.agreement,
        preferenceattachment: data.preferenceattachment,
        prizeattachment: data.prizeattachment,
        sealcertificateprovided: data.sealcertificateprovided,
        selfsignatureconfirmationprovided: data.selfsignatureconfirmationprovided,
        commitmentletterprovided: data.commitmentletterprovided,
        idcopyprovided: data.idcopyprovided,
        freeoption: data.freeoption,
        forfounding: data.forfounding,
        specialnote: data.specialnote,
      };

      // 고객 생성 API 호출
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
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        icon: "error",
        title: "회원정보 입력 실패",
        text:
          "회원 정보를 입력하는 동안 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <h3>회원 정보</h3>
        <div className={styles.content_container}>
          <div className={styles.Font}>관리번호 : {newid}</div>
          <h1></h1>
          <div>
            <Inputbox
              type="text"
              placeholder="이름 *"
              register={register("CustomerData.name", { required: "이름을 입력해주세요." })}
              isError={!!errors.CustomerData?.name}
            />
          </div>
          <div>
            <Inputbox
              type="phone"
              placeholder="휴대폰 번호 *"
              register={register("CustomerData.phone", { required: "휴대폰 번호를 입력해주세요." })}
              isError={!!errors.CustomerData?.phone}
            />
          </div>
          <div>
            <Inputbox
              type="number"
              placeholder="주민번호 앞자리 *"
              register={register("CustomerData.resnumfront", { required: "주민번호 앞자리를 입력해주세요." })}
              isError={!!errors.CustomerData?.resnumfront}
            />
          </div>
          <div>
            <Inputbox
              type="number"
              placeholder="주민번호 뒷자리 *"
              register={register("CustomerData.resnumback", { required: "주민번호 뒷자리를 입력해주세요." })}
              isError={!!errors.CustomerData?.resnumback}
            />
          </div>
          <div>
            <Inputbox
              type="email"
              placeholder="이메일 *"
              register={register("CustomerData.email", { required: "이메일을 입력해주세요." })}
              isError={!!errors.CustomerData?.email}
            />
          </div>
          <div>
            <DropInputbox
              list={classificationlist}
              register={register("customertype", { required: "분류를 선택해주세요." })}
              placeholder="분류 *"
              isError={!!errors.customertype}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="가입경로 *"
              register={register("registerpath", { required: "가입경로를 입력해주세요." })}
              isError={!!errors.registerpath}
            />
          </div>
          <div>
            <DropInputbox
              list={banklist}
              register={register("Financial.bankname", { required: "은행을 선택해주세요." })}
              placeholder="은행 *"
              isError={!!errors.Financial?.bankname}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="계좌번호 *"
              register={register("Financial.accountnum", { required: "계좌번호를 입력해주세요." })}
              isError={!!errors.Financial?.accountnum}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="예금주 *"
              register={register("Financial.accountholder", { required: "예금주를 입력해주세요." })}
              isError={!!errors.Financial?.accountholder}
            />
          </div>
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>법정주소 *</div>
            <PostInputbox
              register={register}
              setValue={setValue}
              namePrefix="LegalAddress"
              postcodeName="LegalAddress.postnumber"
              addressName="LegalAddress.post"
              isError={!!errors.LegalAddress?.postcode || !!errors.LegalAddress?.address || !!errors.LegalAddress?.detailaddress}
            />
            <Inputbox
              type="text"
              placeholder="법정주소 상세 *"
              register={register("LegalAddress.detailaddress", { required: "법정주소를 입력해주세요." })}
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
              addressName="Postreceive.postreceive" // 커스텀 필드 이름 사용
              isError={!!errors.Postreceive?.postcode || !!errors.Postreceive?.addressreceive || !!errors.Postreceive?.detailaddressreceive}
            />
            <Inputbox
              type="text"
              placeholder="우편물 주소지 상세 *"
              register={register("Postreceive.detailaddressreceive", { required: "우편물 주소지를 입력해주세요." })}
              isError={!!errors.Postreceive?.detailaddressreceive}
            />
          </div>
        </div>

        <h3>관리 정보</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <DropInputbox
                list={typeidlist}
                register={register("batch", { required: "제출 순번을 선택해주세요." })}
                placeholder="제출 순번 *"
                isError={!!errors.batch}
              />
              <DropInputbox
                list={typelist}
                name="type"
                register={register("type", { required: "유형을 선택해주세요." })}
                placeholder="유형 *"
                isError={!!errors.type}
              />
            </div>
            <div className={styles.content_body2}>
              <DropInputbox
                list={grouplist}
                name="group"
                register={register("groupname", { required: "그룹을 선택해주세요." })}
                placeholder="그룹 *"
                isError={!!errors.groupname}
              />
              <DropInputbox
                list={turnlist}
                name="turn"
                register={register("turn", { required: "순번을 선택해주세요." })}
                placeholder="순번 *"
                isError={!!errors.turn}
              />
            </div>
          </div>

          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                placeholder="가입일자 *"
                register={register("registerdate", { required: "가입일자를 입력해주세요." })}
                isError={!!errors.registerdate}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="가입가 *"
                register={register("registerprice", { required: "가입가를 입력해주세요." })}
                isError={!!errors.registerprice}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                placeholder="예약금 납입일자 *"
                register={register("Deposit.depositdate", { required: "예약금 납입일자를 입력해주세요." })}
                isError={!!errors.Deposit?.depositdate}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="예약금 *"
                register={register("Deposit.depositammount", { required: "예약금을 입력해주세요." })}
                isError={!!errors.Deposit?.depositammount}
              />
            </div>
          </div>
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
                label="자산A동 계약서"
                name="contract"
                onChange={handleCheckboxChange}
                register={register("contract")}
                isError={!!errors.contract}
              />
            </div>
          </div>
        </div>

        <h3>MGM</h3>
        <div className={styles.content_container}>
          <div>
            <Inputbox
              type="text"
              placeholder="업체명 *"
              register={register("MGM.mgmcompanyname", { required: "업체명을 입력해주세요." })}
              isError={!!errors.MGM?.mgmcompanyname}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="이름 *"
              register={register("MGM.mgmname", { required: "이름을 입력해주세요." })}
              isError={!!errors.MGM?.mgmname}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="기관 *"
              register={register("MGM.mgminstitution", { required: "기관을 입력해주세요." })}
              isError={!!errors.MGM?.mgminstitution}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="계좌 *"
              register={register("MGM.mgmaccount", { required: "계좌를 입력해주세요." })}
              isError={!!errors.MGM?.mgmaccount}
            />
          </div>
        </div>

        <h3>부속서류</h3>
        <div className={styles.content_container}>
          <div>
            <Checkbox
              label="인감증명서"
              name="sealcertificateprovided"
              onChange={handleCheckboxChange}
              register={register("sealcertificateprovided")}
              isError={!!errors.sealcertificateprovided}
            />
          </div>
          <div>
            <Checkbox
              label="본인서명확인서"
              name="selfsignatureconfirmationprovided"
              onChange={handleCheckboxChange}
              register={register("selfsignatureconfirmationprovided")}
              isError={!!errors.selfsignatureconfirmationprovided}
            />
          </div>
          <div>
            <Checkbox
              label="확약서"
              name="commitmentletterprovided"
              onChange={handleCheckboxChange}
              register={register("commitmentletterprovided")}
              isError={!!errors.commitmentletterprovided}
            />
          </div>
          <div>
            <Checkbox
              label="신분증"
              name="idcopyprovided"
              onChange={handleCheckboxChange}
              register={register("idcopyprovided")}
              isError={!!errors.idcopyprovided}
            />
          </div>
          <div>
            <Checkbox
              label="무상옵션"
              name="freeoption"
              onChange={handleCheckboxChange}
              register={register("freeoption")}
              isError={!!errors.freeoption}
            />
          </div>
          <div>
            <Checkbox
              label="창준위용"
              name="forfounding"
              onChange={handleCheckboxChange}
              register={register("forfounding")}
              isError={!!errors.forfounding}
            />
          </div>
          <div>
            <Checkbox
              label="총회동의서"
              name="agreement"
              onChange={handleCheckboxChange}
              register={register("agreement")}
              isError={!!errors.agreement}
            />
          </div>
          <div>
            <Checkbox
              label="선호도조사"
              name="preferenceattachment"
              onChange={handleCheckboxChange}
              register={register("preferenceattachment")}
              isError={!!errors.preferenceattachment}
            />
          </div>
          <div>
            <Checkbox
              label="사은품"
              name="prizeattachment"
              onChange={handleCheckboxChange}
              register={register("prizeattachment")}
              isError={!!errors.prizeattachment}
            />
          </div>
          <div></div>
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

        <h3>담당자 정보</h3>
        <div className={styles.content_container}>
          <div>
            <Inputbox
              type="text"
              placeholder="총괄 *"
              register={register("Responsible.generalmanagement", { required: "총괄을 입력해주세요." })}
              isError={!!errors.Responsible?.generalmanagement}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="본부 *"
              register={register("Responsible.division", { required: "본부를 입력해주세요." })}
              isError={!!errors.Responsible?.division}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="팀 *"
              register={register("Responsible.team", { required: "팀을 입력해주세요." })}
              isError={!!errors.Responsible?.team}
            />
          </div>
          <div>
            <Inputbox
              type="text"
              placeholder="성명 *"
              register={register("Responsible.managername", { required: "성명을 입력해주세요." })}
              isError={!!errors.Responsible?.managername}
            />
          </div>
        </div>

        <h3>기타 정보</h3>
        <div className={styles.content_container}>
          <InputAreabox
            type="text"
            placeholder="기타"
            register={register("specialnote")}
            isError={!!errors.specialnote}
          />
        </div>
        <Button_Y type="submit">저장하기</Button_Y>
      </form>
    </div>
  );
}

export default withAuth(Create); // withAuth HOC 적용
