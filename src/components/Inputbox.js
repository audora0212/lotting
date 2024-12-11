// src/components/Inputbox.js

"use client";

import React, { forwardRef, useState } from "react";
import styles from "@/styles/Inputbox.module.scss";
import { IoMdCloudUpload } from "react-icons/io";

// Checkbox 컴포넌트
export const Checkbox = (props) => {
  const { label, name, onChange, defaultChecked, register, isError, ...rest } = props;

  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={onChange}
        className={`${styles.checkbox} ${isError ? styles.errorInput : ''}`}
        {...register}
        {...rest}
      />
      <label className={styles.checkboxLabel}>{label}</label>
    </div>
  );
};

// Spanbox 컴포넌트
export const Spanbox = ({ children }) => {
  return <span className={styles.spancontainer}>{children}</span>;
};

// 일반 Inputbox 컴포넌트
export const Inputbox = (props) => {
  const {
    type,
    placeholder,
    onChange,
    date_placeholder,
    name,
    defaultValue,
    value,
    register,
    isError, // 추가된 prop
    ...rest
  } = props;

  return (
    <input
      className={`${styles.inputcontainer} ${isError ? styles.errorInput : ''}`}
      data-placeholder={date_placeholder}
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      {...register}
      {...rest}
    />
  );
};

export const Inputbox2 = forwardRef((props, ref) => {
  const {
    type,
    placeholder,
    onChange,
    date_placeholder,
    name,
    defaultValue,
    value,
    isError, // 추가된 prop
    ...rest
  } = props;

  return (
    <input
      className={`${styles.inputcontainer} ${isError ? styles.errorInput : ''}`}
      data-placeholder={date_placeholder}
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      ref={ref} // ref 전달
      {...rest}
    />
  );
});

// Textarea InputAreabox 컴포넌트
export const InputAreabox = (props) => {
  const {
    type,
    placeholder,
    onChange,
    date_placeholder,
    name,
    defaultValue,
    value,
    register,
    isError, // 추가된 prop
    ...rest
  } = props;

  return (
    <textarea
      className={`${styles.areacontainer} ${isError ? styles.errorInput : ''}`}
      data-placeholder={date_placeholder}
      type={type}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      {...register}
      {...rest}
    />
  );
};

// Searchbox 컴포넌트
export const Searchbox = (props) => {
  const { type, placeholder, onChange, date_placeholder, name, register, isError, ...rest } = props;

  return (
    <input
      className={`${styles.searchclient} ${isError ? styles.errorInput : ''}`}
      data-placeholder={date_placeholder}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      {...register}
      {...rest}
    />
  );
};

// Inputbox_L 컴포넌트
export const Inputbox_L = (props) => {
  const { type, placeholder, onChange, date_placeholder, name, defaultValue, register, isError, ...rest } = props;

  return (
    <input
      className={`${styles.inputcontainer_L} ${isError ? styles.errorInput : ''}`}
      data-placeholder={date_placeholder}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      defaultValue={defaultValue}
      {...register}
      {...rest}
    />
  );
};

// Inputbox_M 컴포넌트
export const Inputbox_M = (props) => {
  const {
    type,
    placeholder,
    onChange,
    date_placeholder,
    name,
    defaultValue,
    value,
    register,
    isError, // 추가된 prop
    ...rest
  } = props;

  return (
    <>
      <div className={styles.SearchFont}>{placeholder}</div>
      <input
        className={`${styles.inputcontainer_M} ${isError ? styles.errorInput : ''}`}
        data-placeholder={date_placeholder}
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        defaultValue={defaultValue}
        {...register}
        {...rest}
      />
    </>
  );
};

// LoginInputbox 컴포넌트
export const LoginInputbox = (props) => {
  const { type, placeholder, value, onChange, name, register, isError, ...rest } = props;

  return (
    <input
      className={`${styles.logininputcontainer} ${isError ? styles.errorInput : ''}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...register}
      {...rest}
    />
  );
};

// LongInputbox 컴포넌트
export const LongInputbox = (props) => {
  const { type, placeholder, register, isError, ...rest } = props;

  return (
    <input
      className={`${styles.Longinputcontainer} ${isError ? styles.errorInput : ''}`}
      type={type}
      placeholder={placeholder}
      {...register}
      {...rest}
    />
  );
};

// DropInputbox 컴포넌트
export const DropInputbox = (props) => {
  const { list, placeholder, register, isError, ...rest } = props;

  return (
    <select
      className={`${styles.Dropinputcontainer} ${isError ? styles.errorInput : ''}`}
      {...register}
      {...rest}
    >
      {list.map((i, index) => {
        return (
          <option key={index} value={i.value}>
            {i.item}
          </option>
        );
      })}
    </select>
  );
};

const iconstyle = {
  fontSize: "3.4em",
  textAlign: "center",
  color: "#7152F3",
  paddingRight: "10%",
  paddingLeft: "7%",
};

export const FileInputbox = (props) => {
  const { handleChange, isupload, value, name, register, isError, ...rest } = props;

  // register에서 제공하는 onChange, onBlur, ref 분리
  const { onChange: registerOnChange, onBlur, ref, ...restRegister } = register || {};

  // 두 개의 onChange를 호출하는 함수
  const combinedOnChange = (e) => {
    handleChange(e); // 커스텀 핸들러 호출
    if (registerOnChange) registerOnChange(e); // react-hook-form의 onChange 호출
  };

  return (
    <label className={styles.Fileinputcontainer} htmlFor={name}>
      <input
        type="file"
        id={name} // htmlFor과 동일하게 설정
        onChange={combinedOnChange}
        className={styles.fileInput} // 필요한 클래스명 추가
        name={name}
        ref={ref} // react-hook-form의 ref 전달
        {...restRegister} // 나머지 register 속성 전달
        {...rest}
      />
      <p style={{ textAlign: "center", margin: 0 }}>
        <IoMdCloudUpload style={iconstyle} />
      </p>
      {isupload ? (
        <>
          <p className={styles.successtext}>업로드 완료</p>
          <p className={styles.successfilename}>
            {value}
          </p>
        </>
      ) : (
        <>
          <p className={styles.filetext}>
            드래그 드랍 또는{" "}
            <span className={styles.texthighlight}>업로드 할 파일</span>을
            선택해주세요
          </p>
          <p className={styles.filetypetext}>파일형식 : PDF, PNG, JPEG</p>
        </>
      )}
      {isError && <span className={styles.error}>파일을 업로드해주세요.</span>}
    </label>
  );
};

// PostInputbox 컴포넌트

export const PostInputbox = ({ register, setValue, namePrefix, postcodeName, addressName, isError }) => {
  const [postnumber, setPostnumber] = useState("우편번호");
  const [post, setPost] = useState("주소");

  const getpost = () => {
    if (typeof window !== 'undefined' && window.daum) { // daum 객체가 있는지 확인
      new window.daum.Postcode({
        oncomplete: function (data) {
          const zonecode = data.zonecode;
          const roadAddress = data.roadAddress;

          setPostnumber(zonecode);
          setPost(roadAddress);

          // react-hook-form의 setValue를 사용하여 우편번호와 주소를 설정
          const postcodeField = postcodeName || `${namePrefix}.postcode`;
          const addressField = addressName || `${namePrefix}.address`;

          setValue(postcodeField, zonecode);
          setValue(addressField, roadAddress);
        },
      }).open();
    } else {
      console.error("Daum Postcode 라이브러리가 로드되지 않았습니다.");
    }
  };

  return (
    <div className={styles.postContainer}>
      <input
        type="button"
        onClick={getpost}
        value={postnumber}
        className={`${styles.postcontainer} ${isError ? styles.errorInput : ''}`}
      />
      <input
        type="button"
        onClick={getpost}
        value={post}
        className={`${styles.postcontainer} ${isError ? styles.errorInput : ''}`}
      />
      {isError && <span className={styles.error}>주소를 입력해주세요.</span>}

      {/* 숨겨진 필드 */}
      <input
        type="hidden"
        {...register(postcodeName || `${namePrefix}.postcode`, { required: "우편번호를 입력해주세요." })}
      />
      <input
        type="hidden"
        {...register(addressName || `${namePrefix}.address`, { required: "주소를 입력해주세요." })}
      />
    </div>
  );
};
