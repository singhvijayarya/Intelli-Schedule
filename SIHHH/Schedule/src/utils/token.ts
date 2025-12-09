// src/utils/token.ts
const ACCESS_KEY = "app_access_token";
// Avoid storing refresh token in localStorage if you can — prefer httpOnly cookie.

export const saveAccessToken = (token?: string | null) => {
  try {
    if (!token) {
      localStorage.removeItem(ACCESS_KEY);
      return;
    }
    localStorage.setItem(ACCESS_KEY, token);
  } catch (e) {
    console.error("saveAccessToken error", e);
  }
};

export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(ACCESS_KEY);
  } catch (e) {
    return null;
  }
};

export const clearAccessToken = () => {
  try {
    localStorage.removeItem(ACCESS_KEY);
  } catch (e) {}
};
