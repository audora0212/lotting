"use client";

import React, { useState } from "react";
import styles from "@/styles/Inputbox.module.scss";
import { IoMdCloudUpload } from "react-icons/io";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";

export const Checkbox = (props) => {
  const { label, name, onChange, defaultChecked, register } = props;

  return (
    <div className={styles.checkboxContainer}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        onChange={onChange}
        {...register}
        className={styles.checkbox}
      />
      <label className={styles.checkboxLabel}>{label}</label>
    </div>
  );
};

export const Spanbox = ({ children }) => {
  return (
    <>
      <span className={styles.spancontainer}>{children}</span>
    </>
  );
};

export const Inputbox = (props) => {
  const {
    type,
    placeholder,
    onChange,
    date_placeholder,
    name,
    defaultValue,
    register,
  } = props;

  return (
    <>
      <input
        className={styles.inputcontainer}
        data-placeholder={date_placeholder}
        type={type}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        defaultValue={defaultValue}
        {...register}
      />
    </>
  );
};

export const InputAreabox = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  const onChange = props.onChange;
  const date_placeholder = props.date_placeholder;
  const name = props.name;
  const defaultValue = props.defaultValue;
  const value = props.value;
  return (
    <>
      <textarea
        className={styles.areacontainer}
        data-placeholder={date_placeholder}
        defaultValue={defaultValue}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props.register}
      />
    </>
  );
};

export const Searchbox = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  const onChange = props.onChange;
  const date_placeholder = props.date_placeholder;
  const name = props.name;

  return (
    <>
      <input
        className={styles.searchclient}
        data-placeholder={date_placeholder}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        {...props.register}
      />
    </>
  );
};
export const Inputbox_L = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  const onChange = props.onChange;
  const date_placeholder = props.date_placeholder;
  const name = props.name;
  const defaultValue = props.defaultValue;

  return (
    <>
      <input
        className={styles.inputcontainer_L}
        data-placeholder={date_placeholder}
        type={type}
        name={name}
        placeholder={placeholder}
        {...props.register}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </>
  );
};

export const Inputbox_M = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  const onChange = props.onChange;
  const date_placeholder = props.date_placeholder;
  const name = props.name;
  const defaultValue = props.defaultValue;

  return (
    <>
      <div className={styles.SearchFont}>{placeholder}</div>
      <input
        className={styles.inputcontainer_M}
        data-placeholder={date_placeholder}
        type={type}
        name={name}
        {...props.register}
        onChange={onChange}
        value={defaultValue}
      />
    </>
  );
};

export const LoginInputbox = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  const value = props.value;
  const onChange = props.onChange;
  const name = props.name;

  return (
    <>
      <input
        className={styles.logininputcontainer}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props.register}
      />
    </>
  );
};

export const LongInputbox = (props) => {
  const type = props.type;
  const placeholder = props.placeholder;
  return (
    <>
      <input
        className={styles.Longinputcontainer}
        type={type}
        placeholder={placeholder}
        {...props.register}
      />
    </>
  );
};

export const DropInputbox = (props) => {
  const optionlist = props.list;
  const handlechange = props.handlechange;
  const defaultValue = props.defaultValue;
  const placeholder = props.placeholder;
  const value = props.value;
  return (
    <select
      className={styles.Dropinputcontainer}
      defaultValue={defaultValue}
      {...props.register}
    >
      {optionlist.map((i, index) => {
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
  return (
    <label className={styles.Fileinputcontainer} htmlFor={props.className}>
      <input
        type="file"
        id={props.className}
        onChange={props.handleChange}
        className={props.className}
        name={props.name}
      />
      <p style={{ textAlign: "center", margin: 0 }}>
        <IoMdCloudUpload style={iconstyle} />
      </p>
      {props.isupload ? (
        <>
          <p className={styles.successtext}>업로드완료</p>
          <p className={styles.successfilename}>
            {props.value.toString().slice(12)}
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
    </label>
  );
};
export const PostInputbox = (props) => {
  const [postnumber, setPostnumber] = useState("우편번호");
  const [post, setPost] = useState("주소");
  const [postdetail, setPostdetail] = useState("주소상세");
  const placeholder = props.placeholder;

  const getpost = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        setPostnumber(data.zonecode);
        setPost(data.roadAddress);
        setPostdetail(data.roadAddress + ",");
      },
    }).open();
  };

  const handleChange = (e) => {
    setPostdetail(e.target.value);
  };

  const postInput = () => {
    return [postnumber, post];
  };

  return (
    <>
      <input
        className={styles.postcontainer}
        type="button"
        onClick={getpost}
        defaultValue={postnumber}
        placeholder="우편번호"
      />
      <input
        className={styles.postcontainer}
        type="button"
        onClick={getpost}
        defaultValue={post}
        placeholder="주소"
      />
      <input
        className={styles.inputcontainer}
        type="text"
        onChange={handleChange}
        defaultValue={postdetail}
        {...props.register}
      />
    </>
  );
};
