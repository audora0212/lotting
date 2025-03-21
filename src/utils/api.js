// src/utils/api.js
import axios from "axios";

const path = "http://localhost:8080";
//const path = "http://3.38.181.18:8080";

// 고객 추가 페이지 새로운 아이디 받아오기
export const newIdGenerate = () => {
  return axios
    .get(`${path}/customers/nextId`)
    .then((result) => result.data)
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

// 파일 업로드 (파일명 변경 포함)
export const createFile = (file, custId) => {
  const formData = new FormData();
  const originalName = file.name;
  const extension = originalName.split(".").pop();
  const baseName = originalName.substring(0, originalName.lastIndexOf("."));
  const newFileName = `${custId}_${baseName}.${extension}`;
  formData.append("file", file, newFileName);
  return axios.post(`${path}/files/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadFile = async (id, filename) => {
  try {
    const response = await axios.get(`${path}/files/download`, {
      params: { id, filename },
      responseType: "blob",
    });
    const disposition = response.headers["content-disposition"];
    let fileName = "downloaded_file";
    if (disposition && disposition.indexOf("filename=") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

// 고객 생성
export const createUser = (data) => {
  return axios.post(`${path}/customers`, data);
};

// 고객 검색
export const fetchCustomers = (params) => {
  return axios
    .get(`${path}/customers/search`, { params })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching customers:", error);
      throw error;
    });
};

// 고객 삭제
export const deleteCustomer = (id) => {
  return axios
    .delete(`${path}/customers/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting customer:", error);
      throw error;
    });
};

// 고객 상세 조회
export const fetchCustomerById = (id) => {
  return axios
    .get(`${path}/customers/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching customer:", error);
      throw error;
    });
};

// 납부 전 차수 데이터 조회
export const fetchPendingPhases = async (userId) => {
  try {
    const response = await axios.get(
      `${path}/customers/${userId}/pending-phases`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pending phases:", error);
    throw error;
  }
};

// 납부 후 차수 데이터 조회
export const fetchCompletedPhases = async (userId) => {
  try {
    const response = await axios.get(
      `${path}/customers/${userId}/completed-phases`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching completed phases:", error);
    throw error;
  }
};

// 특정 차수 데이터 조회
export const fetchPhaseData = (userid, chasu) => {
  return axios
    .get(`${path}/customers/${userid}/phases`)
    .then((result) => {
      const phases = result.data;
      const phase = phases.find((p) => p.phaseNumber === parseInt(chasu, 10));
      return phase;
    })
    .catch((error) => {
      console.error("Error fetching phase data:", error);
      throw error;
    });
};

// 특정 차수 데이터 업데이트
export const updatePhaseData = (phaseId, data) => {
  return axios
    .put(`${path}/phases/${phaseId}`, data)
    .then((result) => result.data)
    .catch((error) => {
      console.error("Error updating phase data:", error);
      throw error;
    });
};

// 특정 차수 데이터 업데이트 (콜백 사용)
export const updatePhaseDataWithCallback = (phaseId, data, callback) => {
  axios
    .put(`${path}/phases/${phaseId}`, data)
    .then(() => {
      callback();
    })
    .catch((error) => {
      console.error("Error updating phase data:", error);
    });
};

// 고객 Loan 데이터 조회
export const fetchLoanInit = (userid) => {
  return axios
    .get(`${path}/customers/${userid}/loan`)
    .then((result) => result.data)
    .catch((error) => {
      console.error("Error fetching loan data:", error);
      throw error;
    });
};

// 고객 Loan 데이터 업데이트
export const fetchLoanUpdate = (userid, data, callback) => {
  axios
    .put(`${path}/customers/${userid}/loan`, data)
    .then(() => {
      if (typeof callback === "function") {
        callback();
      }
    })
    .catch((error) => {
      console.error("Error updating loan data:", error);
    });
};

// 매니저 로그인
export const fetchLogin = (username, password) => {
  return axios.post(`${path}/api/auth/signin`, {
    username,
    password,
  });
};

// 매니저 회원가입
export const fetchSignup = (username, email, password, roles) => {
  return axios.post(`${path}/api/auth/signup`, {
    username,
    email,
    password,
    roles,
  });
};

// 고객 취소
export const cancelCustomer = (id) => {
  return axios
    .put(`${path}/customers/${id}/cancel`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error cancelling customer:", error);
      throw error;
    });
};

// 고객 정보 업데이트
export const updateUser = (id, data) => {
  return axios
    .put(`${path}/customers/${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating user:", error);
      throw error;
    });
};

// 연체료 조회
export const fetchLateFees = (name, number) => {
  return axios
    .get(`${path}/latefees`, {
      params: {
        name: name.length > 1 ? name : undefined,
        number: number.length > 1 ? number : undefined,
      },
    })
    .then((result) => result.data)
    .catch((error) => {
      console.error("Error fetching late fees:", error);
      throw error;
    });
};

// 고객 ID 존재 여부 체크
export const checkIdExists = async (id) => {
  try {
    const response = await axios.get(`${path}/customers/${id}`);
    return !!response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    throw error;
  }
};

// 파일 삭제
export const deleteFile = (filename) => {
  return axios
    .delete(`${path}/files/delete`, { params: { filename } })
    .then((response) => response.data)
    .catch((error) => {
      console.error("파일 삭제 오류:", error);
      throw error;
    });
};

// 정계약 고객 수 조회
export const fetchContractedCustomers = async () => {
  try {
    const response = await axios.get(`${path}/customers/count/contracted`);
    return response.data;
  } catch (error) {
    console.error("Error fetching contracted customers count:", error);
    throw error;
  }
};

// 완납 또는 연체 없는 고객 수 조회
export const fetchFullyPaidCustomers = async () => {
  try {
    const response = await axios.get(`${path}/customers/count/fullypaid`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fully paid customers count:", error);
    throw error;
  }
};

// format1 다운로드
export const downloadFormat1 = async (id) => {
  try {
    const response = await axios.get(`${path}/files/format1/${id}`, {
      responseType: "blob",
    });
    let fileName = "일반신청서.xlsx";
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.indexOf("filename=") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading format1:", error);
    throw error;
  }
};

// format2 다운로드
export const downloadFormat2 = async (id) => {
  try {
    const response = await axios.get(`${path}/files/format2/${id}`, {
      responseType: "blob",
    });
    let fileName = "일반부속서류.xlsx";
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.indexOf("filename=") !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading format2:", error);
    throw error;
  }
};

// ================ Deposit 관련 API ================ //

// **추가**: 모든 고객의 입금내역(DepositList DTO) 전체를 조회하는 함수
export const fetchDepositList = async () => {
  try {
    const response = await axios.get(`${path}/depositlist`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deposit list:", error);
    throw error;
  }
};

// 고객의 전체 입금내역 조회 (GET /deposit/customer/{userId})
export const fetchDepositHistoriesByCustomerId = async (userId) => {
  try {
    const response = await axios.get(`${path}/deposit/customer/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deposit histories:", error);
    throw error;
  }
};

// 단일 입금내역 조회 (GET /deposit/{id})
export const fetchDepositHistory = async (depositId) => {
  try {
    const response = await axios.get(`${path}/deposit/${depositId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deposit history:", error);
    throw error;
  }
};

// 입금내역 생성 (POST /deposit)
export const createDepositHistory = async (data) => {
  try {
    const response = await axios.post(`${path}/deposit`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating deposit history:", error);
    throw error;
  }
};

// 입금내역 수정 (PUT /deposit/{id})
export const updateDepositHistory = async (depositId, data) => {
  try {
    const response = await axios.put(`${path}/deposit/${depositId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating deposit history:", error);
    throw error;
  }
};

// 입금내역 삭제 (DELETE /deposit/{id})
export const deleteDepositHistory = async (depositId) => {
  try {
    const response = await axios.delete(`${path}/deposit/${depositId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting deposit history:", error);
    throw error;
  }
};

// JWT 토큰 포함 요청을 위한 Axios 인터셉터 설정
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 특정 차수 데이터 부분 업데이트 (부담금, 업무대행비, 할인액, 면제액, 이동만)
export const updatePhaseDataPartial = (customerId, phaseNumber, data) => {
  return axios
    .put(
      `${path}/phases/customer/${customerId}/phase/${phaseNumber}/modify`,
      data
    )
    .then((result) => result.data)
    .catch((error) => {
      console.error("Error updating phase partial data:", error);
      throw error;
    });
};

export async function uploadExcelFileWithProgress(
  file,
  onProgress,
  onComplete,
  onError
) {
  const formData = new FormData();
  formData.append("file", file);

  // 백엔드 URL (직접 상수 혹은 env 등)
  const backendUrl = `${path}/files/uploadExcelWithProgress`;

  // fetch로 POST
  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      // SSE 스트림을 받기 위해 Accept 헤더 설정
      Accept: "text/event-stream",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("서버 응답 에러: " + response.statusText);
  }

  // 스트림(body)이 없으면 에러
  if (!response.body) {
    throw new Error("ReadableStream을 가져올 수 없습니다");
  }

  // 스트림 → reader
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let currentEvent = "";

  // 무한 루프: chunk 단위로 SSE 처리
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // chunk → 문자열
    buffer += decoder.decode(value, { stream: true });

    // SSE는 \n\n 로 이벤트 경계, 우선 줄 단위로 split
    const lines = buffer.split(/\r?\n/);

    // 마지막 줄 전까지 파싱
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();

      if (!line) {
        // 빈 줄 == 이벤트 구분
        currentEvent = "";
        continue;
      }

      if (line.startsWith("event:")) {
        currentEvent = line.slice("event:".length).trim();
      } else if (line.startsWith("data:")) {
        const data = line.slice("data:".length).trim();
        // 이벤트별 처리
        if (currentEvent === "progress" && onProgress) {
          onProgress(data); // 예: "3/30"
        } else if (currentEvent === "complete" && onComplete) {
          onComplete(data); // 예: "Parsing complete"
        } else if (currentEvent === "error" && onError) {
          onError(data); // 예: "Some error occurred"
        }
      }
    }
    // 마지막 줄 남김
    buffer = lines[lines.length - 1];
  }

  // 남은 부분 처리
  if (buffer) {
    const line = buffer.trim();
    if (line.startsWith("event:")) {
      currentEvent = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      const data = line.slice("data:".length).trim();
      if (currentEvent === "progress" && onProgress) {
        onProgress(data);
      } else if (currentEvent === "complete" && onComplete) {
        onComplete(data);
      } else if (currentEvent === "error" && onError) {
        onError(data);
      }
    }
  }
}

// SSE 엔드포인트를 통해 진행 상황과 최종 fileId를 받고, 그 후 실제 파일 다운로드 요청을 하는 함수
export const downloadRegFile = async (onProgress, onComplete, onError) => {
  try {
    const eventSource = new EventSource(
      `${path}/files/regfiledownload/progress`
    );

    eventSource.addEventListener("progress", (event) => {
      if (onProgress) {
        onProgress(event.data); // 예: "3/48"
      }
    });

    eventSource.addEventListener("complete", async (event) => {
      // complete 이벤트 데이터에는 fileId가 들어있음
      const fileId = event.data;
      try {
        const response = await axios.get(
          `${path}/files/regfiledownload/file?fileId=${fileId}`,
          {
            responseType: "blob",
          }
        );
        const disposition = response.headers["content-disposition"];
        let fileName = "regfile_download.xlsx";
        if (disposition && disposition.indexOf("filename=") !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, "");
          }
        }
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        if (onComplete) {
          onComplete(fileName);
        }
      } catch (downloadError) {
        if (onError) {
          onError(downloadError);
        }
      } finally {
        eventSource.close();
      }
    });

    eventSource.addEventListener("error", (event) => {
      if (onError) {
        onError("SSE 연결 중 오류가 발생했습니다.");
      }
      eventSource.close();
    });
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};

export async function uploadDepositHistoryExcelWithProgress(
  file,
  onProgress,
  onComplete,
  onError
) {
  const formData = new FormData();
  formData.append("file", file);
  // 입금 기록 업로드 백엔드 URL
  const backendUrl = `${path}/api/deposithistory/excel/upload`;

  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("서버 응답 에러: " + response.statusText);
  }
  if (!response.body) {
    throw new Error("ReadableStream을 가져올 수 없습니다");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let currentEvent = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) {
        currentEvent = "";
        continue;
      }
      if (line.startsWith("event:")) {
        currentEvent = line.slice("event:".length).trim();
      } else if (line.startsWith("data:")) {
        const data = line.slice("data:".length).trim();
        if (currentEvent === "progress" && onProgress) {
          onProgress(data);
        } else if (currentEvent === "complete" && onComplete) {
          onComplete(data);
        } else if (currentEvent === "error" && onError) {
          onError(data);
        }
      }
    }
    buffer = lines[lines.length - 1];
  }
  if (buffer) {
    const line = buffer.trim();
    if (line.startsWith("event:")) {
      currentEvent = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      const data = line.slice("data:".length).trim();
      if (currentEvent === "progress" && onProgress) {
        onProgress(data);
      } else if (currentEvent === "complete" && onComplete) {
        onComplete(data);
      } else if (currentEvent === "error" && onError) {
        onError(data);
      }
    }
  }
}
export const downloadDepositHistoryExcel = async (
  onProgress,
  onComplete,
  onError
) => {
  try {
    const eventSource = new EventSource(
      `${path}/api/deposithistory/excel/download/progress`
    );

    eventSource.addEventListener("progress", (event) => {
      if (onProgress) {
        onProgress(event.data); // 예: "3/48"
      }
    });

    eventSource.addEventListener("complete", async (event) => {
      // complete 이벤트 데이터에는 fileId가 들어있음
      const fileId = event.data;
      try {
        const response = await axios.get(
          `${path}/api/deposithistory/excel/download/file?fileId=${fileId}`,
          {
            responseType: "blob",
          }
        );
        const disposition = response.headers["content-disposition"];
        let fileName = "deposit_histories.xlsx";
        if (disposition && disposition.indexOf("filename=") !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, "");
          }
        }
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        if (onComplete) {
          onComplete(fileName);
        }
      } catch (downloadError) {
        if (onError) {
          onError(downloadError);
        }
      } finally {
        eventSource.close();
      }
    });

    eventSource.addEventListener("error", (event) => {
      if (onError) {
        onError("SSE 연결 중 오류가 발생했습니다.");
      }
      eventSource.close();
    });
  } catch (error) {
    if (onError) {
      onError(error);
    }
  }
};

export const registerLoan = async (loanData) => {
  try {
    const response = await axios.post(`${path}/api/loan/register`, loanData);
    return response.data;
  } catch (error) {
    console.error("대출/자납 등록 오류:", error);
    throw error;
  }
};

export const getPhaseSummaries = async () => {
  try {
    const response = await axios.get(`${path}/deposit/phase-summary`);
    return response.data; // 백엔드가 반환하는 데이터 배열
  } catch (error) {
    console.error("Error fetching phase summaries:", error);
    throw error;
  }
};


// 환불 파일 업로드
export async function uploadRefundFileWithProgress(
  file,
  onProgress,
  onComplete,
  onError
) {
  const formData = new FormData();
  formData.append("file", file);
  const backendUrl = `${path}/api/refunds/excel/upload`;
  const response = await fetch(backendUrl, {
    method: "POST",
    headers: { Accept: "text/event-stream" },
    body: formData,
  });
  if (!response.ok) {
    throw new Error("서버 응답 에러: " + response.statusText);
  }
  if (!response.body) {
    throw new Error("ReadableStream을 가져올 수 없습니다");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let currentEvent = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (!line) {
        currentEvent = "";
        continue;
      }
      if (line.startsWith("event:")) {
        currentEvent = line.slice("event:".length).trim();
      } else if (line.startsWith("data:")) {
        const data = line.slice("data:".length).trim();
        if (currentEvent === "progress" && onProgress) onProgress(data);
        else if (currentEvent === "complete" && onComplete) onComplete(data);
        else if (currentEvent === "error" && onError) onError(data);
      }
    }
    buffer = lines[lines.length - 1];
  }
  if (buffer) {
    const line = buffer.trim();
    if (line.startsWith("event:")) {
      currentEvent = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      const data = line.slice("data:".length).trim();
      if (currentEvent === "progress" && onProgress) onProgress(data);
      else if (currentEvent === "complete" && onComplete) onComplete(data);
      else if (currentEvent === "error" && onError) onError(data);
    }
  }
}

// 환불 파일 다운로드
export const downloadRefundFile = async (onProgress, onComplete, onError) => {
  try {
    const eventSource = new EventSource(
      `${path}/api/refunds/excel/download/progress`
    );
    eventSource.addEventListener("progress", (event) => {
      if (onProgress) onProgress(event.data);
    });
    eventSource.addEventListener("complete", async (event) => {
      const fileId = event.data;
      try {
        const response = await axios.get(
          `${path}/api/refunds/excel/download/file?fileId=${fileId}`,
          { responseType: "blob" }
        );
        const disposition = response.headers["content-disposition"];
        let fileName = "refund_file.xlsx";
        if (disposition && disposition.indexOf("filename=") !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, "");
          }
        }
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        if (onComplete) onComplete(fileName);
      } catch (downloadError) {
        if (onError) onError(downloadError);
      } finally {
        eventSource.close();
      }
    });
    eventSource.addEventListener("error", (event) => {
      if (onError) onError("SSE 연결 중 오류가 발생했습니다.");
      eventSource.close();
    });
  } catch (error) {
    if (onError) onError(error);
  }
};
