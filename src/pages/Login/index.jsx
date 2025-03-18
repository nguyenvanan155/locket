import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";
import * as locketService from "../../services/locketService";
import { AuthContext } from "../../context/AuthLocket";
import "ldrs/ring";
import * as utils from "../../utils";

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    showToast("info", "Đang đăng nhập Locket!");

    setTimeout(async () => {
      try {
        const res = await locketService.login(email, password);
        if (!res) {
          showToast("error", "Lỗi: Server không trả về dữ liệu!");
          return;
        }
        showToast("success", "Đăng nhập thành công!");
        console.log("User login response:", res);

        // Lưu token & localId vào sessionStorage
        utils.saveAuthData(
          res.user.idToken,
          res.user.localId,
          parseInt(res.user.expiresIn, 10)
        );

        const idToken = utils.getAuthToken();

        // Lấy thông tin người dùng sau khi login
        const userData = await locketService.getInfo(idToken);
        //Luu vao local
        utils.saveUser(userData);
        if (!userData) {
          showToast("error", "Lỗi: Không thể lấy thông tin người dùng!");
          return;
        }

        setUser(userData); // Cập nhật state (React sẽ re-render)
      } catch (error) {
        console.error(
          "Lỗi đăng nhập:",
          error.response?.data?.message || error.message
        );
        showToast(
          "error",
          error.response?.data?.message || "Đăng nhập thất bại!"
        );
      } finally {
        setLoading(false);
      }
    }, 0); // Chờ 2 giây mới chạy login logic
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md mx-7 p-7 space-y-6 shadow-lg rounded-xl bg-opacity-50 backdrop-blur-3xl bg-base-100 border-base-300 text-base-content">
        <h2 className="text-3xl font-bold text-center">Đăng Nhập Locket</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">Email</label>
            <input
              type="email"
              className="w-full input px-4 py-2 border rounded-lg "
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">Mật khẩu</label>
            <input
              type="password"
              className="w-full input px-4 py-2 rounded-lg "
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary py-2 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <l-ring
                  size="20"
                  stroke="2"
                  bg-opacity="0"
                  speed="2"
                  color="white"
                ></l-ring>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
