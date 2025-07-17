import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    ["token", "memberID", "userEmail", "chakra-ui-color-mode", "userName", "userRole", "userId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setUser(null);
    navigate("/Login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const memberID = localStorage.getItem("memberID");

    // إذا لم يكن المستخدم مسجل دخول سابقًا، لا تسوي logout مباشر!
    if (!user && (!token || !memberID)) {
      logout();
    } else if (token && memberID) {
      setUser({ token, memberID });
    }
  }, [logout, user]); // إضافة logout و user هنا لتجنب التحذير

  const login = (data) => {
    // لا نمسح أي شيء هنا
    localStorage.setItem("token", data.token);
    localStorage.setItem("memberID", data.memberID);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("userRole", data.userRole);
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
