import { selector } from "recoil";
import { fetchNameSearch, fetchNumberSearch, fetchT, fetchUserinfo, fetchLoanInit, fetchChasuData } from "./api";
import { searchnameState, searchnumberState, useridState, searchtypeState, chasuState } from "./atom";

export const userinfoSelector = selector({
    key: 'userinfoSelector',
    get: async ({ get }) => {
      const userid = get(useridState);
      try {
        const data = await fetchUserinfo(userid); 
        return data;
      } catch (error) {
        console.error('Error fetching userinfo:', error);
        throw error; 
      }
    },
});

export const usermoneySelector = selector({
  key: 'usermoneySelector',
  get: async ({ get }) => {
    const userid = get(useridState);
    console.log(userid);
    try {
      const data = await fetchLoanInit(userid);
      return data;
    } catch (error) {
      console.error('Error fetching userinfo: ', error);
      throw error;
    }
  }
})

export const userchasuSelector = selector({
  key: 'userchasuSelector',
  get: async ({get}) => {
    const userid = get(useridState);
    const chasu = get(chasuState);
    if(userid){
    try {
      const data = await fetchChasuData(userid,chasu);
      return data;
    } catch (error) {
      console.error('Error fetching chasu: ',error);
      throw error;
    }}
  }
})


// src/utils/selector.js

export const namesearchSelector = selector({
  key: 'namesearchSelector',
  get: async ({ get }) => {
    const username = get(searchnameState);
    const usernumber = get(searchnumberState);

    try {
      let dataByName = [];
      let dataByNumber = [];

      if (usernumber) {
        dataByNumber = await fetchNumberSearch(usernumber); // `usernumber` 전달
        // 서버에서 부분 매칭을 처리하므로 클라이언트 측 필터링 불필요
      }

      if (username) {
        dataByName = await fetchNameSearch(username);
      }

      if (username && usernumber) {
        // 두 결과의 교집합 반환
        const numberIds = new Set(dataByNumber.map(user => user.id));
        const filteredByName = dataByName.filter(user => numberIds.has(user.id));
        return filteredByName;
      }

      if (usernumber) {
        return dataByNumber;
      }

      if (username) {
        return dataByName;
      }

      return [];
    } catch (error) {
      console.error("namesearchSelector 오류:", error);
      throw error;
    }
  }
});
