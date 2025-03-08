export const getUserFromCookie = () => {
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find(row => row.startsWith("user="));
    return userCookie ? JSON.parse(decodeURIComponent(userCookie.split("=")[1])) : null;
};

export const getUserInfo = (key) => {
    const user = getUserFromCookie();
    return user ? user[key] : null;
};
