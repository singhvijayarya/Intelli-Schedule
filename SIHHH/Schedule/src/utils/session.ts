// src/utils/session.ts
const USER_KEY = "app_user";

export const saveSession = (user: any) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("saveSession error", e);
  }
};

export const getSession = () => {
  try {
    const s = localStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    console.error("getSession error", e);
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("clearSession error", e);
  }
};
