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

// FileInputbox 컴포넌트
export const FileInputbox = (props) => {
  const { className, handleChange, isupload, value, name, register, isError, ...rest } = props;

  return (
    <label className={styles.Fileinputcontainer} htmlFor={className}>
      <input
        type="file"
        id={className}
        onChange={handleChange}
        className={className}
        name={name}
        {...register}
        {...rest}
      />
      <p style={{ textAlign: "center", margin: 0 }}>
        <IoMdCloudUpload style={iconstyle} />
      </p>
      {isupload ? (
        <>
          <p className={styles.successtext}>업로드완료</p>
          <p className={styles.successfilename}>
            {value.toString().slice(12)}
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
export const PostInputbox = (props) => {
  const [postnumber, setPostnumber] = useState("우편번호");
  const [post, setPost] = useState("주소");
  const [postdetail, setPostdetail] = useState("주소상세");
  const { placeholder, register, isError, ...rest } = props;

  const getpost = () => {
    if (typeof window !== 'undefined' && window.daum) { // daum 객체가 있는지 확인
      new window.daum.Postcode({
        oncomplete: function (data) {
          setPostnumber(data.zonecode);
          setPost(data.roadAddress);
          setPostdetail(data.roadAddress + ",");
        },
      }).open();
    } else {
      console.error("Daum Postcode 라이브러리가 로드되지 않았습니다.");
    }
  };

  const handleChange = (e) => {
    setPostdetail(e.target.value);
  };

  return (
    <>
      <input
        className={`${styles.postcontainer} ${isError ? styles.errorInput : ''}`}
        type="button"
        onClick={getpost}
        defaultValue={postnumber}
        placeholder="우편번호"
        {...rest}
      />
      <input
        className={`${styles.postcontainer} ${isError ? styles.errorInput : ''}`}
        type="button"
        onClick={getpost}
        defaultValue={post}
        placeholder="주소"
        {...rest}
      />
      <input
        className={`${styles.inputcontainer} ${isError ? styles.errorInput : ''}`}
        type="text"
        onChange={handleChange}
        defaultValue={postdetail}
        {...register}
        {...rest}
      />
      {isError && <span className={styles.error}>주소상세를 입력해주세요.</span>}
    </>
  );
};
