const checkAccess = () => {
    return !!window.localStorage;
};

export const getItemStorage = (key) => {
    return checkAccess() ? localStorage.getItem(key) : null;
};

export const setItemStorage = (key, value) => {
    if (checkAccess()) {
        localStorage.setItem(key, value);
    }
};

export const removeItemStorage = (key) => {
    if (checkAccess()) {
        localStorage.removeItem(key);
    }
};
