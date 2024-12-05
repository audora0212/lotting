import { selector } from "recoil";
import { fetchNameSearch, fetchNumberSearch, fetchT, fetchUserinfo, fetchLoanInit, fetchChasuData, fetchCustomers, fetchCustomerById, fetchPhaseData } from "./api";
import { searchnameState, searchnumberState, useridState, searchtypeState, chasuState } from "./atom";

//유저 검색
export const userinfoSelector = selector({ 
  key: "userinfoSelector",
  get: async ({ get }) => {
    const userid = get(useridState);
    if (!userid) {
      return null;
    }
    try {
      const data = await fetchCustomerById(userid);
      return data;
    } catch (error) {
      console.error("userinfoSelector 오류:", error);
      throw error;
    }
  },
});
//유저 검색2
export const namesearchSelector = selector({
  key: 'namesearchSelector',
  get: async ({ get }) => {
    const username = get(searchnameState);
    const usernumber = get(searchnumberState);

    try {
      const params = {};
      if (username) params.name = username;
      if (usernumber) params.number = usernumber;

      const data = await fetchCustomers(params);
      return data;
    } catch (error) {
      console.error('namesearchSelector 오류:', error);
      throw error;
    }
  },
});


/**
 * 사용자 대출 정보 셀렉터
 */
export const usermoneySelector = selector({
  key: 'usermoneySelector',
  get: async ({ get }) => {
    const userid = get(useridState);
    if (userid) {
      try {
        const data = await fetchLoanInit(userid);
        return data;
      } catch (error) {
        console.error('Error fetching loan data: ', error);
        throw error;
      }
    }
    return null;
  }
});


/**
 * 사용자 차수(Phase) 정보 셀렉터
 */
export const userchasuSelector = selector({
  key: 'userchasuSelector',
  get: async ({ get }) => {
    const userid = get(useridState);
    const chasu = get(chasuState);
    if (userid && chasu) {
      try {
        const phase = await fetchPhaseData(userid, chasu);
        return phase;
      } catch (error) {
        console.error('Error fetching phase data:', error);
        throw error;
      }
    }
    return null;
  }
});
//=======================================================================================



