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
import { createFile, newIdGenerate } from "@/utils/api";
import { useRouter } from "next/navigation";

import { createUser } from "@/utils/api";
import {
  banklist,
  sintacklist,
  classificationlist,
  typeidlist,
  typelist,
  grouplist,
  turnlist,
  sortlist,
  cancellist,
} from "@/components/droplistdata";

function Createwithdraw() {
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm();

  const [newid, setNewid] = useState("");

  useEffect(() => {
    const newId = newIdGenerate();
    const getData = () => {
      newId.then((dummyData) => {
        setNewid(dummyData);
      });
    };
    getData();
  }, []);

  const [isupload, setIsupload] = useState({
    upload: false,
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
    F: false,
    G: false,
    H: false,
    I: false,
    exception: false,
    investment: false,
    jscontract: false,
  });
  const [file, setFile] = useState({
    upload: "",
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    G: "",
    H: "",
    I: "",
    exception: "",
    investment: "",
    jscontract: "",
  });
  const [files, setFiles] = useState([]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setIsupload((prev) => {
      const updatedState = {
        ...prev,
        [name]: checked,
      };
      return updatedState;
    });
  };

  const handleChange = (e) => {
    // file 핸들링
    const changename = e.target.className;
    console.log(changename);
    const value = e.target.value;
    const originalfile = e.target.files[0];
    const extension = value.split(".")[1];

    setIsupload((prev) => ({ ...prev, [changename]: true }));
    setFile((prev) => ({ ...prev, [changename]: [value] }));
    const file = new File(
      [originalfile],
      [newid] + "_" + [e.target.className] + "." + extension
    );

    setFiles((prev) => [...prev, file]);
  };

  const onSubmit = (data) => {
    data.fileinfo = isupload;
    console.log(data);

    createFile(files);
    createUser(data);

    Swal.fire({
      icon: "success",
      title: "회원정보가 입력되었습니다.",
      text: "관리번호 : " + newid + "/ 회원명 : " + data.userinfo.name,
    });
    reset();
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>회원 정보</h3>
        <div className={styles.content_container}>
          <div className={styles.Font}>관리번호 : {newid}</div> <h1></h1>
          <Inputbox
            type="text"
            placeholder="이름 *"
            register={register("userinfo.name", { required: true })}
          />
          <Inputbox
            type="phone"
            placeholder="휴대폰 번호 *"
            register={register("userinfo.phone", { required: true })}
          />
          <Inputbox
            type="number"
            placeholder="주민번호 앞자리 *"
            register={register("userinfo.firstid", { required: true })}
          />
          <Inputbox
            type="number"
            placeholder="주민번호 뒷자리 *"
            register={register("userinfo.secondid", { required: true })}
          />
          <Inputbox
            type="email"
            placeholder="이메일"
            register={register("userinfo.email")}
          />
          <DropInputbox
            list={cancellist}
            register={register("userinfo.sort")}
          />
          <Inputbox
            type="text"
            placeholder="가입경로"
            register={register("userinfo.come")}
          />
          <DropInputbox list={banklist} register={register("userinfo.bank")} />
          <Inputbox
            type="text"
            placeholder="계좌번호"
            register={register("userinfo.bankid")}
          />
          <Inputbox
            type="text"
            placeholder="예금주"
            register={register("userinfo.bankwho")}
          />
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>법정주소</div>
            <PostInputbox
              placeholder="법정주소"
              name="userinfo.post"
              register={register("userinfo.post")}
            />
          </div>
          <div className={styles.InputboxField}>
            <div className={styles.InputFont}>우편물 주소지</div>
            <PostInputbox
              placeholder="우편물 주소지"
              name="userinfo.getpost"
              register={register("userinfo.getpost")}
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
                register={register("data.submitturn")}
              />
              <DropInputbox
                list={typelist}
                name="type"
                register={register("data.type")}
              />
            </div>
            <div className={styles.content_body2}>
              <DropInputbox
                list={grouplist}
                name="group"
                register={register("data.group")}
              />
              <DropInputbox
                list={turnlist}
                name="turn"
                register={register("data.turn")}
              />
            </div>
          </div>

          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                date_placeholder="가입일자"
                register={register("data.submitdate")}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="가입가"
                register={register("data.submitprice")}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                date_placeholder="예약금 납입일자"
                register={register("data.earnestdate")}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="예약금"
                register={register("data.earnest")}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body3}>
              <Checkbox
                label="7차 면제"
                name="exception"
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="출자금"
                name="investment"
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.content_body3}>
              <Checkbox
                label="자산A동 계약서"
                name="jscontract"
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>

        <h3>MGM</h3>
        <div className={styles.content_container}>
          <Inputbox
            type="text"
            placeholder="업체명"
            register={register("mgm.companyname")}
          />
          <Inputbox
            type="text"
            placeholder="이름"
            register={register("mgm.name")}
          />
          <Inputbox
            type="text"
            placeholder="기관"
            register={register("mgm.organization")}
          />
          <Inputbox
            type="text"
            placeholder="계좌"
            register={register("mgm.accountnumber")}
          />
        </div>
        <h3>가입해지</h3>
        <div className={styles.mainbody}>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                date_placeholder="해지일자 *"
                register={register("cancel.canceldate", { required: true })}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="date"
                date_placeholder="환급일자 *"
                register={register("cancel.paybackdate", { required: true })}
              />
            </div>
            <div className={styles.content_body2}>
              <Inputbox
                type="number"
                placeholder="환급금 *"
                register={register("cancel.paybackprice", { required: true })}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <DropInputbox
                list={banklist}
                register={register("cancel.bank", { required: true })}
              />
            </div>
          </div>
          <div className={styles.content_body}>
            <div className={styles.content_body2}>
              <Inputbox
                type="text"
                placeholder="예금주 *"
                register={register("cancel.bankwho", { required: true })}
              />
            </div>{" "}
            <div className={styles.content_body2}>
              <Inputbox
                type="text"
                placeholder="계좌번호 *"
                register={register("cancel.bankid", { required: true })}
              />
            </div>
          </div>
        </div>

        <h3>지연이자</h3>
        <div className={styles.content_container}>
          <Inputbox
            type="text"
            placeholder="일수 *"
            register={register("delayedloan.loandate", { required: true })}
          />
          <Inputbox
            type="number"
            placeholder="지연이자액 *"
            register={register("delayedloan.loan", { required: true })}
          />
        </div>

        <h3>부속서류</h3>
        <div className={styles.content_container}>
          <Checkbox
            label="인감증명서"
            name="A"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="본인서명확인서"
            name="B"
            onChange={handleCheckboxChange}
          />
          <Checkbox label="확약서" name="C" onChange={handleCheckboxChange} />
          <Checkbox label="신분증" name="D" onChange={handleCheckboxChange} />
          <Checkbox label="무상옵션" name="E" onChange={handleCheckboxChange} />
          <Checkbox label="창준위용" name="F" onChange={handleCheckboxChange} />
          <Checkbox
            label="총회동의서"
            name="G"
            onChange={handleCheckboxChange}
          />
          <Checkbox
            label="선호도조사"
            name="H"
            onChange={handleCheckboxChange}
          />
          <Checkbox label="사은품" name="I" onChange={handleCheckboxChange} />
          <span></span>
          <span></span>
          <span></span>
          <span>파일업로드</span>
          <span></span>
          <FileInputbox
            className="upload"
            name="fileupload"
            value={file["upload"]}
            isupload={isupload["upload"]}
            handleChange={handleChange}
          />
        </div>

        <h3>담당자 정보</h3>
        <div className={styles.content_container}>
          <Inputbox
            type="text"
            placeholder="총괄"
            register={register("ext.manage")}
          />
          <Inputbox
            type="text"
            placeholder="본부"
            register={register("ext.managemain")}
          />
          <Inputbox
            type="text"
            placeholder="팀"
            register={register("ext.manageteam")}
          />
          <Inputbox
            type="text"
            placeholder="성명"
            register={register("ext.managename")}
          />
        </div>

        <h3>기타 정보</h3>
        <div className={styles.content_container}>
          <InputAreabox
            type="text"
            placeholder="기타"
            register={register("ext.ext")}
          />
        </div>
        <h1></h1>
        <Button_Y>저장하기</Button_Y>
        <h1></h1>
      </form>
    </div>
  );
}

export default withAuth(Createwithdraw); // withAuth HOC 적용
