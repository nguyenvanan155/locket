import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as utils from "../utils";
import { showToast } from "../components/Toast";
import * as locketService from "../services/locketService";

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

        if (!idToken) {
          utils.clearAuthData();
          setUser(null);
          return;
        }

        const userData = await locketService.getInfo(idToken, localId);
        if (isMounted) {
          // utils.saveUser(userData);
          // setUser(userData);
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

    checkAuth();

    return () => {
      isMounted = false;
    };
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
