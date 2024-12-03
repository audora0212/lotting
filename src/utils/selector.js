import { selector } from "recoil";
import { fetchNameSearch, fetchNumberSearch, fetchT, fetchUserinfo, fetchLoanInit, fetchChasuData, fetchCustomers, fetchCustomerById } from "./api";
import { searchnameState, searchnumberState, useridState, searchtypeState, chasuState } from "./atom";

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


//=======================================================================================

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


