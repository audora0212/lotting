"use client";
import Mininav from "@/components/Mininav";
import styles from "@/styles/Create.module.scss";
import {
  Checkbox,
  Inputbox,
  PostInputbox,
  InputAreabox,
  DropInputbox,
  FileInputbox,
  InputboxWithLabel,
} from "@/components/Inputbox";
import { Button_Y } from "@/components/Button";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { userinfoSelector } from "@/utils/selector";
import { useState, useEffect } from "react";
import { useridState } from "@/utils/atom";
import { useForm } from "react-hook-form";
import {
  classificationlist,
  banklist,
  sintacklist,
  typeidlist,
  typelist,
  grouplist,
  turnlist,
} from "@/components/droplistdata";
import { updateUserinfo, createFile } from "@/utils/api";
import withAuth from "@/utils/hoc/withAuth";
import Swal from "sweetalert2";

function Modify() {
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const router = useRouter();

  const { register, handleSubmit, setValue, watch } = useForm();
  const onSubmit = async (data) => {
    try {
      data.fileinfo = isupload;
      await createFile(files);
      await updateUserinfo(splitpath[2], data);
      Swal.fire({
        icon: "success",
        title: "회원 정보가 성공적으로 업데이트되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("회원 정보 업데이트 중 오류 발생:", error);
      Swal.fire({
        icon: "error",
        title: "오류 발생",
        text: "회원 정보 업데이트 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  const setIdState = useSetRecoilState(useridState);
  useEffect(() => {
    setIdState(splitpath[2]);
  }, [splitpath, setIdState]);
  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  const handleChange = (e) => {
    const changename = e.target.className;
    const value = e.target.value;
    const originalfile = e.target.files[0];
    const extension = value.split(".")[1];

    const newid = splitpath[2];

    setIsupload((prev) => ({ ...prev, [changename]: true }));
    setFile((prev) => ({ ...prev, [changename]: [value] }));
    const file = new File(
      [originalfile],
      `${newid}_${changename}.${extension}`
    );

    setFiles((prev) => [...prev, file]);
  };

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

    console.log(isupload);
  };

  useEffect(() => {
    if (userselectordata.state === "hasValue" && userselectordata.contents) {
      const userdata = userselectordata.contents;
      const initialFileState = {};
      const initialUploadState = {};

      for (const key in isupload) {
        if (userdata.fileinfo && userdata.fileinfo.hasOwnProperty(key)) {
          initialFileState[key] = userdata.fileinfo[key] ? "파일 존재" : "";
          initialUploadState[key] = !!userdata.fileinfo[key];
        } else {
          initialFileState[key] = "";
          initialUploadState[key] = false;
        }
      }

      setFile(initialFileState);
      setIsupload(initialUploadState);
    }
  }, [userselectordata.state, userselectordata.contents]);

  // Watch the value of the 'sort' field
  const watchSort = watch("userinfo.sort", "");

  useEffect(() => {
    if (watchSort === "x") {
      Swal.fire({
        icon: "info",
        title: "알림",
        text: "해지 고객 항목이 활성화 됩니다.",
        confirmButtonText: "확인",
      });
    }
  }, [watchSort]);

  switch (userselectordata.state) {
    case "hasValue":
      const userdata = userselectordata.contents;
      if (!userdata)
        return (
          <>
            <h1>잘못된 접근입니다</h1>
          </>
        );
      else
        return (
          <>
            <h1></h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3>회원 정보</h3>
              <div className={styles.content_container}>
                <div className={styles.Font}>관리번호 : {userdata.id}</div>
                <h1></h1>
                <div>
                  <div className={styles.InputFont}>이름</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.userinfo.name || ""}
                    register={register("userinfo.name")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>휴대폰 번호</div>
                  <Inputbox
                    type="phone"
                    defaultValue={userdata.userinfo.phone || ""}
                    register={register("userinfo.phone")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>주민번호 앞자리</div>
                  <Inputbox
                    type="number"
                    defaultValue={userdata.userinfo.firstid || ""}
                    register={register("userinfo.firstid")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>주민번호 뒷자리</div>
                  <Inputbox
                    type="number"
                    defaultValue={userdata.userinfo.secondid || ""}
                    register={register("userinfo.secondid")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>이메일</div>
                  <Inputbox
                    type="email"
                    defaultValue={userdata.userinfo.email || ""}
                    register={register("userinfo.email")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>분류</div>
                  <DropInputbox
                    list={classificationlist}
                    register={register("userinfo.sort")}
                    defaultValue={userdata.userinfo.sort || ""}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>가입경로</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.userinfo.come || ""}
                    register={register("userinfo.come")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>은행명</div>
                  <DropInputbox
                    list={banklist}
                    defaultValue={userdata.userinfo.bank || ""}
                    register={register("userinfo.bank")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>계좌번호</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.userinfo.bankid || ""}
                    register={register("userinfo.bankid")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>예금주</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.userinfo.bankwho || ""}
                    register={register("userinfo.bankwho")}
                  />
                </div>

                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>법정주소</div>
                  <textarea
                    className={styles.InputTextarea}
                    defaultValue={userdata.userinfo.getpost || ""}
                    {...register("userinfo.getpost")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>우편물 주소지</div>
                  <textarea
                    className={styles.InputTextarea}
                    defaultValue={userdata.userinfo.post || ""}
                    {...register("userinfo.getpost")}
                  />
                </div>
              </div>
              <h3>관리 정보</h3>
              <div className={styles.mainbody}>
                <div className={styles.content_body}>
                  <div className={styles.content_body2}>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>가입차수</div>
                      <DropInputbox
                        list={typeidlist}
                        defaultValue={userdata.data.submitturn || ""}
                        register={register("data.submitturn")}
                      />
                    </div>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>타입</div>
                      <DropInputbox
                        list={typelist}
                        defaultValue={userdata.data.type || ""}
                        name="type"
                        register={register("data.type")}
                      />
                    </div>
                  </div>
                  <div className={styles.content_body2}>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>군</div>
                      <DropInputbox
                        list={grouplist}
                        defaultValue={userdata.data.group || ""}
                        name="group"
                        register={register("data.group")}
                      />
                    </div>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>순번</div>
                      <DropInputbox
                        list={turnlist}
                        defaultValue={userdata.data.turn || ""}
                        name="turn"
                        register={register("data.turn")}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.content_body}>
                  <div className={styles.content_body2}>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>가입일자</div>
                      <Inputbox
                        type="date"
                        defaultValue={
                          userdata.data.submitdate
                            ? userdata.data.submitdate.substr(0, 10)
                            : ""
                        }
                        date_placeholder="가입일자"
                        register={register("data.submitdate")}
                      />
                    </div>
                  </div>
                  <div className={styles.content_body2}>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>가입가</div>
                      <Inputbox
                        type="number"
                        defaultValue={userdata.data.submitprice || ""}
                        placeholder="가입가"
                        register={register("data.submitprice")}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.content_body}>
                  <div className={styles.content_body2}>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>납임일자</div>
                      <Inputbox
                        type="date"
                        defaultValue={
                          userdata.data.earnestdate
                            ? userdata.data.earnestdate.substr(0, 10)
                            : ""
                        }
                        date_placeholder="예약금 납입일자"
                        register={register("data.earnestdate")}
                      />
                    </div>
                  </div>
                  <div className={styles.content_body2}>
                    <div className={styles.InputboxField}>
                      <div className={styles.InputFont}>예약금</div>
                      <Inputbox
                        type="number"
                        defaultValue={userdata.data.earnest || ""}
                        placeholder="예약금"
                        register={register("data.earnest")}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.content_body}>
                  <div className={styles.content_body3}>
                    <Checkbox
                      label="7차 면제"
                      name="exception"
                      onChange={handleCheckboxChange}
                      defaultChecked={
                        userdata.fileinfo.exception &&
                        JSON.parse(userdata.fileinfo.exception)
                      }
                    />
                  </div>
                  <div className={styles.content_body3}>
                    <Checkbox
                      label="출자금"
                      name="investment"
                      onChange={handleCheckboxChange}
                      defaultChecked={
                        userdata.fileinfo.investment &&
                        JSON.parse(userdata.fileinfo.investment)
                      }
                    />
                  </div>
                  <div className={styles.content_body3}>
                    <Checkbox
                      label="자산A동 계약서"
                      name="jscontract"
                      onChange={handleCheckboxChange}
                      defaultChecked={
                        userdata.fileinfo.jscontract &&
                        JSON.parse(userdata.fileinfo.jscontract)
                      }
                    />
                  </div>
                </div>
              </div>

              {watchSort === "x" && (
                <>
                  <h3>가입해지</h3>
                  <div className={styles.mainbody}>
                    <div className={styles.content_body}>
                      <div className={styles.content_body2}>
                        <Inputbox
                          type="date"
                          date_placeholder="해지일자"
                          register={register("cancel.canceldate")}
                        />
                      </div>
                    </div>
                    <div className={styles.content_body}>
                      <div className={styles.content_body2}>
                        <Inputbox
                          type="date"
                          date_placeholder="환급일자"
                          register={register("cancel.paybackdate")}
                        />
                      </div>
                      <div className={styles.content_body2}>
                        <Inputbox
                          type="number"
                          placeholder="환급금"
                          register={register("cancel.paybackprice")}
                        />
                      </div>
                    </div>
                    <div className={styles.content_body}>
                      <div className={styles.content_body2}>
                        <DropInputbox
                          list={banklist}
                          register={register("cancel.bank")}
                        />
                      </div>
                    </div>
                    <div className={styles.content_body}>
                      <div className={styles.content_body2}>
                        <Inputbox
                          type="text"
                          placeholder="예금주"
                          register={register("cancel.bankwho")}
                        />
                      </div>{" "}
                      <div className={styles.content_body2}>
                        <Inputbox
                          type="text"
                          placeholder="계좌번호"
                          register={register("cancel.bankid")}
                        />
                      </div>
                    </div>
                  </div>

                  <h3>지연이자</h3>
                  <div className={styles.content_container}>
                    <Inputbox
                      type="text"
                      placeholder="일수"
                      register={register("delayedloan.loandate")}
                    />
                    <Inputbox
                      type="number"
                      placeholder="지연이자액"
                      register={register("delayedloan.loan")}
                    />
                  </div>
                </>
              )}

              <h3>부속서류</h3>
              <div className={styles.content_container}>
                <Checkbox
                  label="인감증명서"
                  name="A"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.A)}
                />
                <Checkbox
                  label="본인서명확인서"
                  name="B"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.B)}
                />
                <Checkbox
                  label="확약서"
                  name="C"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.C)}
                />
                <Checkbox
                  label="신분증"
                  name="D"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.D)}
                />
                <Checkbox
                  label="무상옵션"
                  name="E"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.E)}
                />
                <Checkbox
                  label="창준위용"
                  name="F"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.F)}
                />
                <Checkbox
                  label="총회동의서"
                  name="G"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.G)}
                />
                <Checkbox
                  label="선호도조사"
                  name="H"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.H)}
                />
                <Checkbox
                  label="사은품"
                  name="I"
                  onChange={handleCheckboxChange}
                  defaultChecked={JSON.parse(userdata.fileinfo.I)}
                />

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
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>총괄</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.ext.manage || ""}
                    placeholder="총괄"
                    register={register("ext.manage")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>본부</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.ext.managemain || ""}
                    placeholder="본부"
                    register={register("ext.managemain")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>팀</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.ext.manageteam || ""}
                    placeholder="팀"
                    register={register("ext.manageteam")}
                  />
                </div>
                <div className={styles.InputboxField}>
                  <div className={styles.InputFont}>성명</div>
                  <Inputbox
                    type="text"
                    defaultValue={userdata.ext.managename || ""}
                    placeholder="성명"
                    register={register("ext.managename")}
                  />
                </div>
              </div>
              <h3>기타 정보</h3>
              <div className={styles.content_container}>
                <InputAreabox
                  type="text"
                  placeholder="기타"
                  defaultValue={userdata.ext.ext || ""}
                  register={register("ext.ext")}
                />
              </div>
              <h1></h1>
              <Button_Y>저장하기</Button_Y>
            </form>
          </>
        );

    case "loading":
      console.log("loading");
      return <div>Loading...</div>;

    case "hasError":
      throw userselectordata.contents;
  }
}

export default withAuth(Modify);
