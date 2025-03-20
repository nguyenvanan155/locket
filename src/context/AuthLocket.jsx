import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import * as utils from "../utils";
import { showToast } from "../components/Toast";
import * as locketService from "../services/locketService"; // Đảm bảo import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(utils.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const idToken = utils.getAuthToken();
        const localId = utils.getLocalId();

        if (!idToken || !localId) {
            utils.clearAuthData();
            setUser(null);
          // throw new Error("Người dùng chưa đăng nhập!");
          // return showToast("error", "Vui lòng đăng nhập!");
        }

        await axios.get(utils.API_URL.CHECK_AUTH_URL, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "X-User-Id": localId,
          },
          withCredentials: true,
        });

        if (isMounted) {
          try {
            const userData = await locketService.getInfo(idToken);
            utils.saveUser(userData);
          } catch (error) {
            utils.removeUser();
            utils.clearAuthData();
            console.error("Không lấy được thông tin người dùng:", error);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.warn("Lỗi xác thực:", error);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    }; // Cleanup tránh memory leak
  }, []);


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
