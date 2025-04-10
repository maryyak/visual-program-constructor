import {getItemStorage, removeItemStorage} from "./localStorageAccess";

export const isTokenValid = () => {
    const tokenExp = getItemStorage('token_exp');
    if( tokenExp && Date.now() > Number(tokenExp)) {
        removeItemStorage("token");
        removeItemStorage("token_exp");
        removeItemStorage("username")
    }
};
