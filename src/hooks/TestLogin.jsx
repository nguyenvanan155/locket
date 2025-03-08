import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as utils from "../utils";
import * as locketService from "../services/locketService";
import { AuthContext } from "../context/AuthLocket";

const Login1 = () => {
    const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    toast.dismiss();
    const toastId = toast.info("Logging in ....", {
      ...utils.toastSettings,
    });

    setLoading(true);

    const handleAfterLogin = (userInfo) => {
        setUser(userInfo.user);

        toast.dismiss();
        toast.success("Login successfully", {
            ...utils.toastSettings,
        });
        // Lưu vào cookie
        utils.setCookie("user", JSON.stringify(userInfo.user), 1);
    };

    const res = await locketService.login(email, password);
    console.log(res);
    if (res) {
      handleAfterLogin(res);
    } else if (toast.isActive(toastId)) {
      toast.update(toastId, {
        ...utils.toastSettings,
        render: "Username or password is incorrect",
        type: "error",
      });
    } else {
      toast.dismiss();
      toast.error("Username or password is incorrect", {
        ...utils.toastSettings,
      });
    }

    setLoading(false);
  };

  const handleEnterOnInput = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-7 p-7 space-y-6 shadow-lg rounded-xl bg-opacity-50 backdrop-blur-3xl">
        <h2 className="text-3xl font-bold text-center">Đăng Nhập Locket Test</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login1;
