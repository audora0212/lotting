import { atom } from "recoil";

export const userinfoState = atom({
    key: 'userinfoState',
    default: null,
});

export const useridState = atom({
    key: 'useridState',
    default: null,
})

export const searchnameState = atom({
    key: 'searchnameState',
    default: "",
})

export const searchnumberState = atom({
    key: 'searchnumberState',
    default: "",
});

export const searchtypeState = atom({
    key: 'searchtypeState',
    default: null,
});

export const usernewState = atom ({
    key: 'usernewState',
    default: null
})

export const chasuState = atom ({
    key: 'chasuState',
    default: null
})
