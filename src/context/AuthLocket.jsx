import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showToast } from "../components/Toast";
import * as locketService from "../services/locketService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
  const [loading, setLoading] = useState(!user); // Nếu đã có user, không cần loading

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Nếu đã có user => Không cần xác thực lại
        if (user) {
          setLoading(false);
          return;
        }

        const idToken = utils.getAuthToken();
        const localId = utils.getLocalId();

        if (!idToken || !localId) {
          throw new Error("Thiếu thông tin xác thực!");
        }

        const userData = await locketService.getInfo(idToken, localId);
        if (!userData || !userData.uid) {
          throw new Error("Thông tin người dùng không hợp lệ!");
        }

        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        if (isMounted) {
          utils.clearAuthData();
          setUser(null);
          showToast("error", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Chỉ gọi API nếu chưa có user
    if (!user) checkAuth();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return useMemo(
    () => (
      <AuthContext.Provider value={{ user, setUser, loading }}>
        {children}
      </AuthContext.Provider>
    ),
    [user, loading]
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
