"use client";

import React, { forwardRef, useState, useEffect } from "react";
import styles from "@/styles/Inputbox.module.scss";
import { IoMdCloudUpload } from "react-icons/io";

export const Checkbox = (props) => {
  const { label, name, onChange, checked, register, isError, ...rest } = props;
  const { onChange: onChangeFromRegister, onBlur, name: fieldName, ref } = register;
  
  return (
    <label className={`${styles.customCheckbox} ${isError ? styles.errorInput : ''}`}>
      <input
        type="checkbox"
        name={fieldName}
        checked={checked} // controlled 방식으로 처리
        ref={ref}
        onBlur={onBlur}
        onChange={(e) => {
          if (onChangeFromRegister) onChangeFromRegister(e);
          if (onChange) onChange(e);
        }}
        {...rest}
      />
      <span className={styles.checkboxText}>{label}</span>
    </label>
  );
};

export const Spanbox = ({ children }) => {
  return <span className={styles.spancontainer}>{children}</span>;
};

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
    isError,
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

export const MGMInputbox = (props) => {
  const {
    type,
    placeholder,
    onChange,
    name,
    defaultValue,
    value,
    register,
    isError,
    ...rest
  } = props;

  return (
    <input
      className={`${styles.mgmInputContainer} ${isError ? styles.errorInput : ''}`}
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

export const InputboxSmall = (props) => {
  const {
    type,
    placeholder,
    onChange,
    date_placeholder,
    name,
    defaultValue,
    value,
    register,
    isError,
    ...rest
  } = props;

  return (
    <input
      className={`${styles.inputcontainerSmall} ${isError ? styles.errorInput : ''}`}
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
    isError,
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
      ref={ref}
      {...rest}
    />
  );
});

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
    isError,
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
    isError,
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
  const { onChange: registerOnChange, onBlur, ref, ...restRegister } = register || {};

  const combinedOnChange = (e) => {
    handleChange(e);
    if (registerOnChange) registerOnChange(e);
  };

  return (
    <label className={styles.Fileinputcontainer} htmlFor={name}>
      <input
        type="file"
        id={name}
        onChange={combinedOnChange}
        className={styles.fileInput}
        name={name}
        ref={ref}
        {...restRegister}
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
            드래그 드랍 또는 <span className={styles.texthighlight}>업로드 할 파일</span>을 선택해주세요
          </p>
          <p className={styles.filetypetext}>파일형식 : PDF, PNG, JPEG</p>
        </>
      )}
      {isError && <span className={styles.error}>파일을 업로드해주세요.</span>}
    </label>
  );
};

export function ExcelFileInputbox(props) {
  const {
    handleChange,
    isupload,
    value,
    name,
    register,
    isError,
    ...rest
  } = props;

  const { onChange: registerOnChange, onBlur, ref, ...restRegister } = register || {};

  const combinedOnChange = (e) => {
    if (handleChange) handleChange(e);
    if (registerOnChange) registerOnChange(e);
  };

  const iconStyle = {
    fontSize: "2rem",
    color: "#999",
  };

  return (
    <label className={styles.Fileinputcontainer} htmlFor={name}>
      <input
        type="file"
        id={name}
        onChange={combinedOnChange}
        className={styles.fileInput}
        name={name}
        ref={ref}
        {...restRegister}
        {...rest}
      />
      <p style={{ textAlign: "center", margin: 0 }}>
        <IoMdCloudUpload style={iconStyle} />
      </p>
      {isupload ? (
        <>
          <p className={styles.successtext}>업로드 완료</p>
          <p className={styles.successfilename}>{value}</p>
        </>
      ) : (
        <>
          <p className={styles.filetext}>
            드래그 드롭 또는{" "}
            <span className={styles.texthighlight}>업로드 할 파일</span>을 선택해주세요
          </p>
          <p className={styles.filetypetext}>파일형식 : XLSX / XLS</p>
        </>
      )}
      {isError && <span className={styles.error}>파일을 업로드해주세요.</span>}
    </label>
  );
}

export const PostInputbox = ({ register, setValue, namePrefix, postcodeName, addressName, isError }) => {
  const [postnumber, setPostnumber] = useState("우편번호");
  const [post, setPost] = useState("주소");

  const getpost = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const zonecode = data.zonecode;
          const roadAddress = data.roadAddress;

          setPostnumber(zonecode);
          setPost(roadAddress);

          const postcodeField = postcodeName || `${namePrefix}.postnumber`;
          const addressField = addressName || `${namePrefix}.post`;

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

      <input
        type="hidden"
        {...register(postcodeName || `${namePrefix}.postnumber`, { required: "우편번호를 입력해주세요." })}
      />
      <input
        type="hidden"
        {...register(addressName || `${namePrefix}.post`, { required: "주소를 입력해주세요." })}
      />
    </div>
  );
};

export const PostInputbox2 = ({ register, setValue, namePrefix, postcodeName, addressName, isError, initialPostNumber, initialAddress }) => {
  const [postnumber, setPostnumber] = useState(initialPostNumber || "우편번호");
  const [post, setPost] = useState(initialAddress || "주소");

  useEffect(() => {
    setPostnumber(initialPostNumber || "우편번호");
    setPost(initialAddress || "주소");
  }, [initialPostNumber, initialAddress]);

  const getpost = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const zonecode = data.zonecode;
          const roadAddress = data.roadAddress;

          setPostnumber(zonecode);
          setPost(roadAddress);

          const postcodeField = postcodeName || `${namePrefix}.postnumber`;
          const addressField = addressName || `${namePrefix}.post`;

          setValue(postcodeField, zonecode);
          setValue(addressField, roadAddress);
        },
      }).open();
    } else {
      console.error("Daum Postcode 라이브러리가 로드되지 않았습니다.");
    }
  };

  return (
    <div className={styles.postContainer2}>
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

      <input
        type="hidden"
        {...register(postcodeName || `${namePrefix}.postnumber`, { required: "우편번호를 입력해주세요." })}
      />
      <input
        type="hidden"
        {...register(addressName || `${namePrefix}.post`, { required: "주소를 입력해주세요." })}
      />
    </div>
  );
};


export const InputboxGray = (props) => {
  const {
    type,
    placeholder,
    onChange,
    name,
    value,
    register,
    isError,
    ...rest
  } = props;

  return (
    <div className={`${styles.grayInputWrapper} ${isError ? styles.errorInputWrapper : ''}`}>
      <input
        className={`${styles.grayInput} ${isError ? styles.errorInput : ''}`}
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        {...register}
        {...rest}
      />
    </div>
  );
};
