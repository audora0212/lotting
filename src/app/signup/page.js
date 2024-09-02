"use client";
import { LoginInputbox } from "@/components/Inputbox";
import { Button } from "@/components/Button";
import styles from "@/styles/Signup.module.scss";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import Swal from "sweetalert2"; // Import SweetAlert2
import { fetchSignup } from "@/utils/api";

export default function Signup() {
  const [userform, setUserform] = useState({
    username: "",
    email: "",
    password: "",
    roles: ["user"], //default 는 유저
  });

  const router = useRouter(); // Initialize useRouter

  const handleChange = (e) => {
    setUserform({
      ...userform,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchSignup(
        userform.username,
        userform.email,
        userform.password,
        userform.roles
      );
      Swal.fire({
        title: "회원가입 성공",
        text: "회원가입이 완료되었습니다!",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        router.push("/dashboard"); // Redirect to dashboard
      });
      console.log("Signup successful:", response.data);
    } catch (error) {
      console.error("Signup error:", error.response.data.message);
      Swal.fire({
        title: "회원가입 실패",
        text: error.response.data.message || "회원가입에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.childcontainer}>
        <h1 className={styles.title}>회원가입</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <LoginInputbox
            className={styles.input}
            name="username"
            placeholder="사용자 이름 (아이디)"
            onChange={handleChange}
          />
          <LoginInputbox
            className={styles.input}
            name="email"
            placeholder="이메일"
            type="email"
            onChange={handleChange}
          />
          <LoginInputbox
            className={styles.input}
            name="password"
            placeholder="비밀번호"
            type="password"
            onChange={handleChange}
          />
          <Button className={styles.button} type="submit">
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
}
