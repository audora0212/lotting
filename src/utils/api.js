import axios from "axios";
const path = "http://localhost:8080";
// JUN SEO OH 개발 환경에서 사용하는 path 입니다. git 시 필수로 주석처리.\

export const newIdGenerate = () => {
  return axios
    .get(path + "/api/generateid")
    .then((result) => {
      return result.data.nextid;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const createFile = (files) => {
  console.log("업로드 파일 : ", files);
  const formData = new FormData();
  files.forEach((data) => {
    formData.append("file", data);
  });

  return axios.post(path + "/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data", charset: "utf-8" },
  });
};

export const downloadFile = async (id, filename) => {
  try {
    const response = await axios.post(
      path + "/api/download",
      { id, filename },
      {
        responseType: "blob",
      }
    );

    // 파일 다운로드
    const name = response.headers["content-disposition"]
      .split("filename=")[1]
      .replace(/"/g, "");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    link.style.cssText = "display:none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error downloading file:", error);
    // 오류 처리
  }
};

export const createUser = (data) => { // 고객 만들기 Customer
  return axios.post(path + "/api/createuser", data);
};

export const updateUserinfo = (userid, data) => { // 고객 업데이트 Customer
  if (data.fileinfo && data.fileinfo._id) {
    delete data.fileinfo._id;
  }
  return axios
    .put(path + "/api/userinfo/" + userid, data)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const fetchLogin = (username, password) => { // 매니저 로그인
  return axios.post(path + "/api/auth/signin", {
    username,
    password,
  });
};

export const fetchSignup = (username, email, password, roles) => { // 매니저 회원가입
  return axios.post(path + "/api/auth/signup", {
    username,
    email,
    password,
    roles,
  });
};

export const fetchUserinfo = (userid) => { // 고객정보 불러오기 customer
  return axios
    .get(path + "/api/userinfo/" + userid)
    .then((result) => {
      return result.data[0];
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const searchFinchasu = (userid) => { // Customer의 이미 납부된 Phase 불러오기
  return axios
    .get(path + "/api/chasuinit/fin/" + userid)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const searchPrechasu = (userid) => { // Customer의 아직 납부되지 않은 Phase 불러오기
  return axios
    .get(path + "/api/chasuinit/pre/" + userid)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};


export const fetchNameSearch = (username) => { //이름으로 Customer 찾기
  return axios
    .get(path + "/api/searchname/" + username)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};


export const fetchNumberSearch = (usernumber) => { //회원번호로 Customer 찾기
  return axios
    .get(`${path}/api/searchnumber/${usernumber}`)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};


export const deleteUser = (id) => { //Customer 삭제
  return axios
    .post(path + "/api/deleteuser", { id: id.toString() })
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      throw error;
    });
};

export const fetchLoanInit = (userid) => { //Customer 의 id로 Loan 항목 불러오기
  return axios
    .get(path + "/api/chasuinit/loan/" + userid)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const fetchChasuData = (userid, chasu) => { // Customer
  return axios
    .get(path + "/api/chasu/" + userid + "/" + chasu)
    .then((result) => {
      return result.data[0];
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const fetchChasuUpdate = (userid, data, callback) => {
  axios
    .put(path + "/api/chasuupdate/" + userid, data)
    .then(() => {
      callback();
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
};

export const fetchLoanUpdate = (userid, data, callback) => {
  axios
    .put(path + "/api/loanupdate/" + userid, data)
    .then(() => {
      callback();
    })
    .catch((error) => {
      console.error("Error updating data: ", error);
    });
};
