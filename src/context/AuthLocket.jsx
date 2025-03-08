import { createContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import * as utils from "../utils";
import { showToast } from "../components/Toast";
import * as locketService from "../services/locketService"; // Đảm bảo import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState("null");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                await axios.get(utils.API_URL.CHECK_AUTH_URL, { withCredentials: true });
                if (isMounted) {
                    try {
                        const userData = await locketService.getInfo();
                        // showToast("success", "Lấy thông tin thành công!");
                        setUser(userData);
                    } catch (error) {
                        // showToast("error", "Không lấy được thông tin người dùng");
                    }
                }
            } catch (error) {
                if (isMounted) {
                    //Báo chưa login
                    // showToast("warning", error.response?.data?.message || "Lỗi xác thực!");
                    setUser(null);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        checkAuth();

        return () => { isMounted = false; }; // Cleanup tránh memory leak
    }, []);

    return useMemo(() => (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    ), [user, loading]);

};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
