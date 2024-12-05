"use client";
import Mininav from "@/components/Mininav";
import styles from "@/styles/Create.module.scss";
import {
  Checkbox,
  Inputbox,
  InputAreabox,
  DropInputbox,
  FileInputbox,
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
  typeidlist,
  typelist,
  grouplist,
  turnlist,
} from "@/components/droplistdata";
import { updateUserinfo, createFile } from "@/utils/api";
import withAuth from "@/utils/hoc/withAuth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// SweetAlert2 with React Content
const MySwal = withReactContent(Swal);

function Modify() {
  const pathname = usePathname();
  const splitpath = pathname.split("/");
  const router = useRouter();

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      customerData: {
        name: "",
        phone: "",
        resnumfront: "",
        resnumback: "",
        email: "",
        sort: "",
      },
      registerpath: "",
      financial: {
        bankname: "",
        accountnum: "",
        accountholder: "",
        trustcompany: "",
      },
      legalAddress: {
        postnumber: "",
        province: "",
        county: "",
        detailaddress: "",
      },
      postreceive: {
        postnumberreceive: "",
        provincereceive: "",
        countyreceive: "",
        detailaddressreceive: "",
      },
      deposits: {
        depositdate: "",
        depositammount: "",
      },
      type: "",
      groupname: "",
      turn: "",
      registerdate: "",
      registerprice: "",
      additional: "",
      specialnote: "",
      prizewinning: "",
      attachments: {
        isuploaded: false,
        fileinfo: "",
        exemption7: false,
        investmentfile: false,
        contract: false,
        agreement: false,
        sealcertificateprovided: false,
        selfsignatureconfirmationprovided: false,
        idcopyprovided: false,
        commitmentletterprovided: false,
        forfounding: false,
        freeoption: false,
        preferenceattachment: false,
        prizeattachment: false,
      },
      loan: {
        loandate: "",
        loanbank: "",
        loanammount: "",
        selfdate: "",
        selfammount: "",
        loanselfsum: "",
        loanselfcurrent: "",
      },
      responsible: {
        generalmanagement: "",
        division: "",
        team: "",
        managername: "",
      },
      dahim: {
        dahimsisang: "",
        dahimdate: "",
        dahimprepaid: "",
        dahimfirst: "",
        dahimfirstpay: "",
        dahimdate2: "",
        dahimsource: "",
        dahimsecond: "",
        dahimsecondpay: "",
        dahimdate3: "",
        dahimsum: "",
      },
      mgm: {
        mgmfee: "",
        mgmcompanyname: "",
        mgmname: "",
        mgminstitution: "",
        mgmaccount: "",
      },
      firstemp: {
        firstemptimes: "",
        firstempdate: "",
      },
      secondemp: {
        secondemptimes: "",
        secondempdate: "",
      },
      meetingattend: {
        howtoattend: "",
        ftofattend: false,
        selfattend: false,
        behalfattend: false,
      },
      votemachine: {
        machine1: false,
        machine2_1: false,
        machine2_2: false,
        machine2_3: false,
        machine2_4: false,
        machine3: false,
        machine4: false,
        machine5: false,
        machine6: false,
        machine7: false,
        machine8: false,
        machine9: false,
        machine10: false,
      },
      cancel: {
        canceldate: "",
        paybackdate: "",
        paybackprice: "",
        bank: "",
        bankwho: "",
        bankid: "",
      },
      delayedloan: {
        loandate: "",
        loan: "",
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      data.attachments.isuploaded = Object.values(data.attachments).some(
        (val) => val === true
      );

      // Handle file uploads if any
      if (files.length > 0) {
        const uploadResponses = await Promise.all(
          files.map((file) => createFile(file))
        );
        data.attachments.fileinfo = uploadResponses.map((res) => res.data).join(", ");
      }

      await updateUserinfo(splitpath[2], data);

      // Success alert
      await MySwal.fire({
        icon: "success",
        title: "회원 정보가 성공적으로 업데이트되었습니다.",
        confirmButtonText: "확인",
      });

      // 리다이렉션
      router.push(`/inputmoney/userinfo/${splitpath[2]}`);
    } catch (error) {
      console.error("회원 정보 업데이트 중 오류 발생:", error);
      // Error alert
      await MySwal.fire({
        icon: "error",
        title: "오류 발생",
        text: "회원 정보 업데이트 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  const setIdState = useSetRecoilState(useridState);
  useEffect(() => {
    if (splitpath.length > 2) {
      setIdState(splitpath[2]);
    }
  }, [splitpath, setIdState]);

  const userselectordata = useRecoilValueLoadable(userinfoSelector);

  const handleChange = (e) => {
    const changename = e.target.name;
    const originalfile = e.target.files[0];

    if (!originalfile) return;

    const extension = originalfile.name.split(".").pop();
    const newid = splitpath[2];

    // 업데이트 상태
    setIsupload((prev) => ({ ...prev, [changename]: true }));
    const renamedFile = new File(
      [originalfile],
      `${newid}_${changename}.${extension}`,
      { type: originalfile.type }
    );

    setFiles((prev) => [...prev, renamedFile]);
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
    exemption7: false,
    investmentfile: false,
    contract: false,
    agreement: false,
    sealcertificateprovided: false,
    selfsignatureconfirmationprovided: false,
    idcopyprovided: false,
    commitmentletterprovided: false,
    forfounding: false,
    freeoption: false,
    preferenceattachment: false,
    prizeattachment: false,
  });

  const [files, setFiles] = useState([]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setIsupload((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (userselectordata.state === "hasValue" && userselectordata.contents) {
      const userdata = userselectordata.contents;

      // Initialize form with fetched data
      reset({
        customerData: {
          name: userdata.customerData?.name || "",
          phone: userdata.customerData?.phone || "",
          resnumfront: userdata.customerData?.resnumfront || "",
          resnumback: userdata.customerData?.resnumback || "",
          email: userdata.customerData?.email || "",
          sort: userdata.customertype || "",
        },
        registerpath: userdata.registerpath || "",
        financial: {
          bankname: userdata.financial?.bankname || "",
          accountnum: userdata.financial?.accountnum || "",
          accountholder: userdata.financial?.accountholder || "",
          trustcompany: userdata.financial?.trustcompany || "",
        },
        legalAddress: {
          postnumber: userdata.legalAddress?.postnumber || "",
          province: userdata.legalAddress?.province || "",
          county: userdata.legalAddress?.county || "",
          detailaddress: userdata.legalAddress?.detailaddress || "",
        },
        postreceive: {
          postnumberreceive: userdata.postreceive?.postnumberreceive || "",
          provincereceive: userdata.postreceive?.provincereceive || "",
          countyreceive: userdata.postreceive?.countyreceive || "",
          detailaddressreceive: userdata.postreceive?.detailaddressreceive || "",
        },
        deposits: {
          depositdate: userdata.deposits?.depositdate
            ? userdata.deposits.depositdate.split("T")[0]
            : "",
          depositammount: userdata.deposits?.depositammount || "",
        },
        type: userdata.type || "",
        groupname: userdata.groupname || "",
        turn: userdata.turn || "",
        registerdate: userdata.registerdate
          ? userdata.registerdate.split("T")[0]
          : "",
        registerprice: userdata.registerprice || "",
        additional: userdata.additional || "",
        specialnote: userdata.specialnote || "",
        prizewinning: userdata.prizewinning || "",
        attachments: {
          isuploaded: userdata.attachments?.isuploaded || false,
          fileinfo: userdata.attachments?.fileinfo || "",
          exemption7: userdata.attachments?.exemption7 || false,
          investmentfile: userdata.attachments?.investmentfile || false,
          contract: userdata.attachments?.contract || false,
          agreement: userdata.attachments?.agreement || false,
          sealcertificateprovided:
            userdata.attachments?.sealcertificateprovided || false,
          selfsignatureconfirmationprovided:
            userdata.attachments?.selfsignatureconfirmationprovided || false,
          idcopyprovided: userdata.attachments?.idcopyprovided || false,
          commitmentletterprovided:
            userdata.attachments?.commitmentletterprovided || false,
          forfounding: userdata.attachments?.forfounding || false,
          freeoption: userdata.attachments?.freeoption || false,
          preferenceattachment:
            userdata.attachments?.preferenceattachment || false,
          prizeattachment: userdata.attachments?.prizeattachment || false,
        },
        loan: {
          loandate: userdata.loan?.loandate
            ? userdata.loan.loandate.split("T")[0]
            : "",
          loanbank: userdata.loan?.loanbank || "",
          loanammount: userdata.loan?.loanammount || "",
          selfdate: userdata.loan?.selfdate
            ? userdata.loan.selfdate.split("T")[0]
            : "",
          selfammount: userdata.loan?.selfammount || "",
          loanselfsum: userdata.loan?.loanselfsum || "",
          loanselfcurrent: userdata.loan?.loanselfcurrent || "",
        },
        responsible: {
          generalmanagement: userdata.responsible?.generalmanagement || "",
          division: userdata.responsible?.division || "",
          team: userdata.responsible?.team || "",
          managername: userdata.responsible?.managername || "",
        },
        dahim: {
          dahimsisang: userdata.dahim?.dahimsisang || "",
          dahimdate: userdata.dahim?.dahimdate
            ? userdata.dahim.dahimdate.split("T")[0]
            : "",
          dahimprepaid: userdata.dahim?.dahimprepaid || "",
          dahimfirst: userdata.dahim?.dahimfirst || "",
          dahimfirstpay: userdata.dahim?.dahimfirstpay || "",
          dahimdate2: userdata.dahim?.dahimdate2
            ? userdata.dahim.dahimdate2.split("T")[0]
            : "",
          dahimsource: userdata.dahim?.dahimsource || "",
          dahimsecond: userdata.dahim?.dahimsecond || "",
          dahimsecondpay: userdata.dahim?.dahimsecondpay || "",
          dahimdate3: userdata.dahim?.dahimdate3
            ? userdata.dahim.dahimdate3.split("T")[0]
            : "",
          dahimsum: userdata.dahim?.dahimsum || "",
        },
        mgm: {
          mgmfee: userdata.mgm?.mgmfee || "",
          mgmcompanyname: userdata.mgm?.mgmcompanyname || "",
          mgmname: userdata.mgm?.mgmname || "",
          mgminstitution: userdata.mgm?.mgminstitution || "",
          mgmaccount: userdata.mgm?.mgmaccount || "",
        },
        firstemp: {
          firstemptimes: userdata.firstemp?.firstemptimes || "",
          firstempdate: userdata.firstemp?.firstempdate
            ? userdata.firstemp.firstempdate.split("T")[0]
            : "",
        },
        secondemp: {
          secondemptimes: userdata.secondemp?.secondemptimes || "",
          secondempdate: userdata.secondemp?.secondempdate
            ? userdata.secondemp.secondempdate.split("T")[0]
            : "",
        },
        meetingattend: {
          howtoattend: userdata.meetingattend?.howtoattend || "",
          ftofattend: userdata.meetingattend?.ftofattend || false,
          selfattend: userdata.meetingattend?.selfattend || false,
          behalfattend: userdata.meetingattend?.behalfattend || false,
        },
        votemachine: {
          machine1: userdata.votemachine?.machine1 || false,
          machine2_1: userdata.votemachine?.machine2_1 || false,
          machine2_2: userdata.votemachine?.machine2_2 || false,
          machine2_3: userdata.votemachine?.machine2_3 || false,
          machine2_4: userdata.votemachine?.machine2_4 || false,
          machine3: userdata.votemachine?.machine3 || false,
          machine4: userdata.votemachine?.machine4 || false,
          machine5: userdata.votemachine?.machine5 || false,
          machine6: userdata.votemachine?.machine6 || false,
          machine7: userdata.votemachine?.machine7 || false,
          machine8: userdata.votemachine?.machine8 || false,
          machine9: userdata.votemachine?.machine9 || false,
          machine10: userdata.votemachine?.machine10 || false,
        },
        cancel: {
          canceldate: userdata.cancel?.canceldate
            ? userdata.cancel.canceldate.split("T")[0]
            : "",
          paybackdate: userdata.cancel?.paybackdate
            ? userdata.cancel.paybackdate.split("T")[0]
            : "",
          paybackprice: userdata.cancel?.paybackprice || "",
          bank: userdata.cancel?.bank || "",
          bankwho: userdata.cancel?.bankwho || "",
          bankid: userdata.cancel?.bankid || "",
        },
        delayedloan: {
          loandate: userdata.delayedloan?.loandate || "",
          loan: userdata.delayedloan?.loan || "",
        },
      });
    }
  }, [userselectordata.state, userselectordata.contents, reset]);

  // Watch the value of the 'sort' field
  const watchSort = watch("customerData.sort", "");

  useEffect(() => {
    if (watchSort === "x") {
      MySwal.fire({
        icon: "info",
        title: "알림",
        text: "해지 고객 항목이 활성화 됩니다.",
        confirmButtonText: "확인",
      });
    }
  }, [watchSort]);

  if (userselectordata.state === "loading") {
    return <div>Loading...</div>;
  }

  if (userselectordata.state === "hasError") {
    return <div>오류가 발생했습니다.</div>;
  }

  if (userselectordata.state === "hasValue") {
    const userdata = userselectordata.contents;
    if (!userdata) {
      return (
        <>
          <h1>잘못된 접근입니다</h1>
        </>
      );
    } else {
      return (
        <>
          <Mininav />
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
                  defaultValue={userdata.customerData?.name || ""}
                  {...register("customerData.name", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>휴대폰 번호</div>
                <Inputbox
                  type="phone"
                  defaultValue={userdata.customerData?.phone || ""}
                  {...register("customerData.phone", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>주민번호 앞자리</div>
                <Inputbox
                  type="number"
                  defaultValue={userdata.customerData?.resnumfront || ""}
                  {...register("customerData.resnumfront", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>주민번호 뒷자리</div>
                <Inputbox
                  type="number"
                  defaultValue={userdata.customerData?.resnumback || ""}
                  {...register("customerData.resnumback", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>이메일</div>
                <Inputbox
                  type="email"
                  defaultValue={userdata.customerData?.email || ""}
                  {...register("customerData.email", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>분류</div>
                <DropInputbox
                  list={classificationlist}
                  {...register("customerData.sort", { required: true })}
                  defaultValue={userdata.customertype || ""}
                  placeholder="분류"
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>가입경로</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.registerpath || ""}
                  {...register("registerpath", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>은행명</div>
                <DropInputbox
                  list={banklist}
                  {...register("financial.bankname", { required: true })}
                  defaultValue={userdata.financial?.bankname || ""}
                  placeholder="은행명"
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>계좌번호</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.financial?.accountnum || ""}
                  {...register("financial.accountnum", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>예금주</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.financial?.accountholder || ""}
                  {...register("financial.accountholder", { required: true })}
                  required
                />
              </div>

              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>법정주소</div>
                <textarea
                  className={styles.InputTextarea}
                  defaultValue={userdata.legalAddress?.detailaddress || ""}
                  {...register("legalAddress.detailaddress", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>우편물 주소지</div>
                <textarea
                  className={styles.InputTextarea}
                  defaultValue={userdata.postreceive?.detailaddressreceive || ""}
                  {...register("postreceive.detailaddressreceive", { required: true })}
                  required
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
                      {...register("deposits.depositdate", { required: true })}
                      defaultValue={userdata.deposits?.depositdate || ""}
                      placeholder="가입차수"
                      required
                    />
                  </div>
                  <div className={styles.InputboxField}>
                    <div className={styles.InputFont}>타입</div>
                    <DropInputbox
                      list={typelist}
                      {...register("type", { required: true })}
                      defaultValue={userdata.type || ""}
                      placeholder="타입"
                      required
                    />
                  </div>
                </div>
                <div className={styles.content_body2}>
                  <div className={styles.InputboxField}>
                    <div className={styles.InputFont}>군</div>
                    <DropInputbox
                      list={grouplist}
                      {...register("groupname", { required: true })}
                      defaultValue={userdata.groupname || ""}
                      placeholder="군"
                      required
                    />
                  </div>
                  <div className={styles.InputboxField}>
                    <div className={styles.InputFont}>순번</div>
                    <DropInputbox
                      list={turnlist}
                      {...register("turn", { required: true })}
                      defaultValue={userdata.turn || ""}
                      placeholder="순번"
                      required
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
                        userdata.registerdate
                          ? userdata.registerdate.split("T")[0]
                          : ""
                      }
                      {...register("registerdate", { required: true })}
                      required
                    />
                  </div>
                </div>
                <div className={styles.content_body2}>
                  <div className={styles.InputboxField}>
                    <div className={styles.InputFont}>가입가</div>
                    <Inputbox
                      type="number"
                      defaultValue={userdata.registerprice || ""}
                      placeholder="가입가"
                      {...register("registerprice", { required: true })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.content_body}>
                <div className={styles.content_body2}>
                  <div className={styles.InputboxField}>
                    <div className={styles.InputFont}>납입일자</div>
                    <Inputbox
                      type="date"
                      defaultValue={
                        userdata.deposits?.depositdate
                          ? userdata.deposits.depositdate.split("T")[0]
                          : ""
                      }
                      {...register("deposits.depositdate", { required: true })}
                      required
                    />
                  </div>
                </div>
                <div className={styles.content_body2}>
                  <div className={styles.InputboxField}>
                    <div className={styles.InputFont}>예약금</div>
                    <Inputbox
                      type="number"
                      defaultValue={userdata.deposits?.depositammount || ""}
                      placeholder="예약금"
                      {...register("deposits.depositammount", { required: true })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className={styles.content_body}>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="7차 면제"
                    name="exemption7"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.exemption7 || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="출자금"
                    name="investmentfile"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.investmentfile || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="자산A동 계약서"
                    name="contract"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.contract || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="총회동의서"
                    name="agreement"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.agreement || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="인감증명서"
                    name="sealcertificateprovided"
                    onChange={handleCheckboxChange}
                    defaultChecked={
                      userdata.attachments?.sealcertificateprovided || false
                    }
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="본인서명확인서"
                    name="selfsignatureconfirmationprovided"
                    onChange={handleCheckboxChange}
                    defaultChecked={
                      userdata.attachments?.selfsignatureconfirmationprovided || false
                    }
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="신분증"
                    name="idcopyprovided"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.idcopyprovided || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="확약서"
                    name="commitmentletterprovided"
                    onChange={handleCheckboxChange}
                    defaultChecked={
                      userdata.attachments?.commitmentletterprovided || false
                    }
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="창준위용"
                    name="forfounding"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.forfounding || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="무상옵션"
                    name="freeoption"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.freeoption || false}
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="선호도조사"
                    name="preferenceattachment"
                    onChange={handleCheckboxChange}
                    defaultChecked={
                      userdata.attachments?.preferenceattachment || false
                    }
                  />
                </div>
                <div className={styles.content_body3}>
                  <Checkbox
                    label="사은품"
                    name="prizeattachment"
                    onChange={handleCheckboxChange}
                    defaultChecked={userdata.attachments?.prizeattachment || false}
                  />
                </div>

                <span></span>
                <span></span>
                <span></span>
                <span>파일업로드</span>
                <span></span>
                <FileInputbox
                  name="upload"
                  handleChange={handleChange}
                />
              </div>
            </div>

            <h3>담당자 정보</h3>
            <div className={styles.content_container}>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>총괄</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.responsible?.generalmanagement || ""}
                  {...register("responsible.generalmanagement", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>본부</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.responsible?.division || ""}
                  {...register("responsible.division", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>팀</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.responsible?.team || ""}
                  {...register("responsible.team", { required: true })}
                  required
                />
              </div>
              <div className={styles.InputboxField}>
                <div className={styles.InputFont}>성명</div>
                <Inputbox
                  type="text"
                  defaultValue={userdata.responsible?.managername || ""}
                  {...register("responsible.managername", { required: true })}
                  required
                />
              </div>
            </div>

            <h3>기타 정보</h3>
            <div className={styles.content_container}>
              <InputAreabox
                type="text"
                placeholder="기타"
                defaultValue={userdata.dahim?.dahimsum || ""}
                {...register("dahim.dahimsum")}
              />
            </div>
            <h1></h1>
            <Button_Y type="submit">저장하기</Button_Y>
            <h1></h1>
          </form>
        </>
      );
    }

    return null;
  }

  return null;
}

export default withAuth(Modify);
