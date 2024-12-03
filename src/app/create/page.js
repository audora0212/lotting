"use client";
// src/app/create/page.js
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
import withAuth from "@/utils/hoc/withAuth"; // withAuth HOC 사용

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

  const { register, handleSubmit, reset } = useForm();

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
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      const selectedFile = selectedFiles[0];
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
      }));
    }
  };

  const onSubmit = async (data) => {
    try {
      // 1단계: 숫자 필드 변환
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
          depositammount: parseInt(data.Deposit.depositammount),
        },
      };

      // 2단계: 파일 업로드 및 파일 정보 가져오기
      let uploadedFileInfo = "";

      if (file) {
        const uploadResponse = await createFile(file);
        uploadedFileInfo = uploadResponse.data; // 실제 응답 구조에 따라 조정 필요
      }

      // 3단계: 파일 정보를 포함한 attachments 구성
      const attachments = {
        ...isupload,
        fileinfo: uploadedFileInfo, // 백엔드의 Attachments 모델에 맞게 조정
      };

      // 4단계: 완전한 Customer 객체 구성
      const customerData = {
        customertype: parsedData.customertype,
        type: parsedData.type,
        groupname: parsedData.type+parsedData.groupname,
        turn: parsedData.turn,
        batch: parsedData.batch,
        registerdate: parsedData.registerdate,
        registerprice: parsedData.registerprice,
        additional: parsedData.additional || "",
        registerpath: parsedData.registerpath,
        specialnote: parsedData.specialnote,
        prizewinning: parsedData.prizewinning || "",
        customerData: parsedData.CustomerData,
        legalAddress: parsedData.LegalAddress,
        postreceive: parsedData.Postreceive,
        financial: parsedData.Financial,
        deposits: parsedData.Deposit,
        attachments: attachments,
        loan: parsedData.Loan || {},
        responsible: parsedData.Responsible,
        dahim: parsedData.Dahim || {},
        mgm: parsedData.MGM,
        firstemp: parsedData.Firstemp || {},
        secondemp: parsedData.Secondemp || {},
        meetingattend: parsedData.Meetingattend || {},
        votemachine: parsedData.Votemachine || {},
      };

      // 5단계: Customer 데이터를 백엔드로 전송
      const createUserResponse = await createUser(customerData);

      // 6단계: 성공 처리
      Swal.fire({
        icon: "success",
        title: "회원정보가 입력되었습니다.",
        text:
          "관리번호 : " +
          createUserResponse.data.id +
          "/ 회원명 : " +
          parsedData.CustomerData.name,
      });

      // 7단계: 폼 및 상태 초기화
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
      window.scrollTo(0, 0);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원 정보</h3>
        <div className={styles.content_container}>
          <div className={styles.Font}>관리번호 : {newid}</div>
          <h1></h1>
          <Inputbox
            type="text"
            placeholder="이름 *"
            register={register("CustomerData.name", { required: true })}
          />
          <Inputbox
            type="phone"
            placeholder="휴대폰 번호 *"
            register={register("CustomerData.phone", { required: true })}
          />
          <Inputbox
            type="number"
            placeholder="주민번호 앞자리 *"
            register={register("CustomerData.resnumfront", { required: true })}
          />
          <Inputbox
            type="number"
            placeholder="주민번호 뒷자리 *"
            register={register("CustomerData.resnumback", { required: true })}
          />
          <Inputbox
            type="email"
            placeholder="이메일 *"
            register={register("CustomerData.email", { required: true })}
          />
          <DropInputbox
            list={classificationlist}
            register={register("customertype", { required: true })}
            placeholder="분류 *"
          />
          <Inputbox
            type="text"
            placeholder="가입경로 *"
            register={register("registerpath", { required: true })}
          />
          <DropInputbox
            list={banklist}
            register={register("Financial.bankname", { required: true })}
            placeholder="은행 *"
          />
          <Inputbox
            type="text"
            placeholder="계좌번호 *"
            register={register("Financial.accountnum", { required: true })}
          />
          <Inputbox
            type="text"
            placeholder="예금주 *"
            register={register("Financial.accountholder", { required: true })}
          />
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>법정주소 *</div>
            <PostInputbox
              placeholder="법정주소"
              register={register("LegalAddress.detailaddress", {
                required: true,
              })}
            />
          </div>
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>우편물 주소지 *</div>
            <PostInputbox
              placeholder="우편물 주소지"
              register={register("Postreceive.detailaddressreceive", {
                required: true,
              })}
            />
          </div>
          <div className={styles.InputboxField}></div>
        </div>

        <h3>관리 정보</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <DropInputbox
                list={typeidlist}
                register={register("batch", { required: true })}
                placeholder="제출 순번 *"
              />
              <DropInputbox
                list={typelist}
                name="type"
                register={register("type", { required: true })}
                placeholder="유형 *"
              />
            </div>
            <div className={styles.content_body2}>
              <DropInputbox
                list={grouplist}
                name="group"
                register={register("groupname", { required: true })}
                placeholder="그룹 *"
              />
              <DropInputbox
                list={turnlist}
                name="turn"
                register={register("turn", { required: true })}
                placeholder="순번 *"
              />
            </div>
          </div>

          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                date_placeholder="가입일자 *"
                register={register("registerdate", { required: true })}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="가입가 *"
                register={register("registerprice", { required: true })}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                date_placeholder="예약금 납입일자 *"
                register={register("Deposit.depositdate", { required: true })}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="예약금 *"
                register={register("Deposit.depositammount", { required: true })}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body3}>
              <Checkbox
                label="7차 면제"
                name="exemption7"
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="출자금"
                name="investmentfile"
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="자산A동 계약서"
                name="contract"
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>

        <h3>MGM</h3>
        <div className={styles.content_container}>
          <Inputbox
            type="text"
            placeholder="업체명 *"
            register={register("MGM.mgmcompanyname", { required: true })}
          />
          <Inputbox
            type="text"
            placeholder="이름 *"
            register={register("MGM.mgmname", { required: true })}
          />
          <Inputbox
            type="text"
            placeholder="기관 *"
            register={register("MGM.mgminstitution", { required: true })}
          />
          <Inputbox
            type="text"
            placeholder="계좌 *"
            register={register("MGM.mgmaccount", { required: true })}
          />
        </div>

        <h3>부속서류</h3>
        <div className={styles.content_container}>
          <Checkbox
            label="인감증명서"
            name="sealcertificateprovided"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="본인서명확인서"
            name="selfsignatureconfirmationprovided"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="확약서"
            name="commitmentletterprovided"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="신분증"
            name="idcopyprovided"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="무상옵션"
            name="freeoption"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="창준위용"
            name="forfounding"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="총회동의서"
            name="agreement"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="선호도조사"
            name="preferenceattachment"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="사은품"
            name="prizeattachment"
            onChange={handleCheckboxChange}
          />
          <span></span>
          <span></span>
          <span></span>
          <span>파일업로드</span>
          <span></span>
          <FileInputbox
            name="fileupload"
            handleChange={handleFileChange}
          />
        </div>

        <h3>담당자 정보</h3>
        <div className={styles.content_container}>
          <Inputbox
            type="text"
            placeholder="총괄 *"
            register={register("Responsible.generalmanagement", {
              required: true,
            })}
          />
          <Inputbox
            type="text"
            placeholder="본부 *"
            register={register("Responsible.division", { required: true })}
          />
          <Inputbox
            type="text"
            placeholder="팀 *"
            register={register("Responsible.team", { required: true })}
          />
          <Inputbox
            type="text"
            placeholder="성명 *"
            register={register("Responsible.managername", { required: true })}
          />
        </div>

        <h3>기타 정보</h3>
        <div className={styles.content_container}>
          <InputAreabox
            type="text"
            placeholder="기타 *"
            register={register("specialnote", { required: true })}
          />
        </div>
        <h1></h1>
        <Button_Y type="submit">저장하기</Button_Y>
        <h1></h1>
      </form>
    </div>
  );
}

export default withAuth(Create); // withAuth HOC 적용
