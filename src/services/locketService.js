import axios from "axios";
import * as utils from "../utils";

//Login
export const login = async (email, password) => {
  try {
    const res = await axios.post(
      utils.API_URL.LOGIN_URL,
      { email, password },
      { withCredentials: true } // Nhận cookie từ server
    );

    // Kiểm tra nếu API trả về lỗi nhưng vẫn có status 200
    if (res.data?.success === false) {
      console.error("Login failed:", res.data.message);
      return null;
    }

    return res.data; // Trả về dữ liệu từ server
  } catch (error) {
    console.error(
      "Login error:",
      error.response?.data?.message || error.message
    );
    return null;
  }
};
//Logout
export const logout = async () => {
  try {
    const response = await axios.get(utils.API_URL.LOGOUT_URL, { withCredentials: true });
    return response.data; // ✅ Trả về dữ liệu từ API (ví dụ: { message: "Đã đăng xuất!" })
  } catch (error) {
    console.error("❌ Lỗi khi đăng xuất:", error.response?.data || error.message);
    throw error.response?.data || error.message; // ✅ Trả về lỗi nếu có
  }
};
//Get info
export const getInfo = async () => {
  try {
    // console.log("📡 Đang lấy thông tin người dùng...");
    const res = await axios.post(utils.API_URL.GET_INFO_URL, {}, { withCredentials: true });

    // console.log("✅ Thông tin người dùng nhận được:", res.data);
    return res.data.user;
  } catch (error) {
    // console.error("❌ Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
    throw error; // Quăng lỗi để xử lý trong component
  }
};
//Get Momemnt
export const getLatestMoment = async () => {
  try {    
    const res = await axios.post(utils.API_URL.GET_LASTEST_URL,{}, { withCredentials: true });

    console.log("Moment mới nhất:", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy moment:", error.response?.data || error.message);
    throw error; // Quăng lỗi để xử lý trong component
  }
};
export const uploadMedia = async (formData) => {
    let timeOutId;
  
    try {
      const fileType = formData.get("images") ? "image" : "video"; 
  
      // Thời gian chờ tùy vào loại file
      timeOutId = setTimeout(() => {
        console.log("⏳ Uploading is taking longer than expected...");
      }, fileType === "image" ? 5000 : 10000);
  
      const response = await axios.post(utils.API_URL.UPLOAD_MEDIA_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      clearTimeout(timeOutId);
      
      console.log("✅ Upload thành công:", response.data);
      return response.data;
    } catch (error) {
      clearTimeout(timeOutId);
  
      console.error("❌ Lỗi khi upload:", error.response?.data || error.message);
      throw error;
    }
  };
  
