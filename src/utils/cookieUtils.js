// cookies.js

export const setCookie = (name, value, hours) => {
  document.cookie = `${name}=${value}; path=/; Secure; SameSite=None; max-age=${
    hours * 60 * 60
  }`;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; max-age=0; Secure; SameSite=None`;
};
