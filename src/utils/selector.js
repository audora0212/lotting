import { selector } from "recoil";
import { fetchNameSearch, fetchNumberSearch,fetchT,fetchUserinfo, fetchLoanInit,fetchChasuData } from "./api";
import { searchnameState,searchnumberState, useridState, searchtypeState, chasuState } from "./atom";

export const userinfoSelector = selector({
    key: 'userinfoSelector',
    get: async ({ get }) => {
      const userid = get(useridState);
      try {
        const data = await fetchUserinfo(userid); 
        return data;
      } catch (error) {
        console.error('Error fetching userinfo:', error);
        throw error; // 에러 처리를 위해 다시 throw
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


export const namesearchSelector = selector({
  key: 'namesearchSelector',
  get: async ({ get }) => {
    const username = get(searchnameState);
    const usernumber = get(searchnumberState);
    
    const dataByName = await fetchNameSearch(username);
    const dataByNumber = await fetchNumberSearch(usernumber);

    // 이름과 관리번호 둘 다 있는 경우, 합친 결과를 반환
    if (username && usernumber) {
      return [...dataByName, ...dataByNumber];
    }

    // 둘 중 하나만 있는 경우, 해당 결과만 반환
    return username ? dataByName : dataByNumber;
  }
});

