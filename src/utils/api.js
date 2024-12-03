import axios from "axios";
const path = "http://localhost:8080";//Immigrant


export const newIdGenerate = () => { 
  return axios
    .get(path + "/customers/nextId")
    .then((result) => {
      return result.data; // 백엔드에서 Integer를 반환하므로 result.data가 관리번호.
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const createFile = (files) => { 
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  return axios.post(path + "/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data", charset: "utf-8" },
  });
};

export const createUser = (data) => { // 고객 만들기 Customer
  return axios.post(path + "/customers", data);
};


export const fetchCustomers = (params) => {
  // params는 { name: '...', number: '...'} 형태
  return axios.get(`${path}/customers/search`, { params })
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching customers:', error);
      throw error;
    });
};


export const deleteCustomer = (id) => {
  return axios.delete(`${path}/customers/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting customer:', error);
      throw error;
    });
};

//=====================================================================================

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
