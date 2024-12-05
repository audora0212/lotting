// src/app/modify/[id]/page.js

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
import withAuth from "@/utils/hoc/withAuth"; // withAuth HOC 사용

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { updateUser, fetchCustomerById, createFile } from "@/utils/api";
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

function Modify({ params }) {
  const router = useRouter();
  const { id } = params; // URL에서 id 파라미터 추출

  const { register, handleSubmit, reset, setValue } = useForm();

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

  useEffect(() => {
    const getData = async () => {
      try {
        const customer = await fetchCustomerById(id);
        if (customer) {
          // 폼에 기본값 설정
          reset({
            customertype: customer.customertype,
            type: customer.type,
            groupname: customer.groupname,
            turn: customer.turn,
            batch: customer.batch,
            registerdate: customer.registerdate,
            registerprice: customer.registerprice,
            additional: customer.additional,
            registerpath: customer.registerpath,
            specialnote: customer.specialnote,
            prizewinning: customer.prizewinning,
            CustomerData: {
              name: customer.customerData.name,
              phone: customer.customerData.phone,
              resnumfront: customer.customerData.resnumfront,
              resnumback: customer.customerData.resnumback,
              email: customer.customerData.email,
            },
            LegalAddress: {
              detailaddress: customer.legalAddress.detailaddress,
            },
            Postreceive: {
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
            // 필요한 다른 필드들도 추가
          });

          // 체크박스 상태 설정
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
      const extension = selectedFile.name.split(".").pop();
      const renamedFile = new File(
        [selectedFile],
        `${id}_${name}.${extension}`,
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

      let uploadedFileInfo = existingFileInfo;

      if (file) {
        const uploadResponse = await createFile(file);
        uploadedFileInfo = uploadResponse.data;
      }

      const attachments = {
        ...isupload,
        fileinfo: uploadedFileInfo,
      };

      const customerData = {
        id: parseInt(id), // 고객 ID 포함
        customertype: parsedData.customertype,
        type: parsedData.type,
        groupname: parsedData.groupname,
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
        responsible: parsedData.Responsible,
        mgm: parsedData.MGM,
        // 필요한 다른 필드들도 추가
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
      window.scrollTo(0, 0);
      router.push(`/search/${id}`); // 수정 후 해당 고객 상세 페이지로 이동
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

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원 정보 수정</h3>
        <div className={styles.content_container}>
          <div className={styles.Font}>관리번호 : {id}</div>
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
                checked={isupload.exemption7}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="출자금"
                name="investmentfile"
                checked={isupload.investmentfile}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="자산A동 계약서"
                name="contract"
                checked={isupload.contract}
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
            checked={isupload.sealcertificateprovided}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="본인서명확인서"
            name="selfsignatureconfirmationprovided"
            checked={isupload.selfsignatureconfirmationprovided}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="확약서"
            name="commitmentletterprovided"
            checked={isupload.commitmentletterprovided}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="신분증"
            name="idcopyprovided"
            checked={isupload.idcopyprovided}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="무상옵션"
            name="freeoption"
            checked={isupload.freeoption}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="창준위용"
            name="forfounding"
            checked={isupload.forfounding}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="총회동의서"
            name="agreement"
            checked={isupload.agreement}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="선호도조사"
            name="preferenceattachment"
            checked={isupload.preferenceattachment}
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="사은품"
            name="prizeattachment"
            checked={isupload.prizeattachment}
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
          {existingFileInfo && (
            <div className={styles.existingFile}>
              기존 파일: {existingFileInfo}
            </div>
          )}
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
        <Button_Y type="submit">수정하기</Button_Y>
        <h1></h1>
      </form>
    </div>
  );
}

export default withAuth(Modify); // withAuth HOC 적용
