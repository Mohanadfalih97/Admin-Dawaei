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

  // ✅ يعمل فقط عند أول تحميل للصفحة
 useEffect(() => {
  const token = localStorage.getItem("token");
  const memberID = localStorage.getItem("memberID");

  // If the user is not logged in, logout the user
  if (!user && (!token || !memberID)) {
    logout();
  } else if (token && memberID) {
    setUser({ token, memberID });
  }
}, [logout, user]); // Include logout and user as dependencies
 // ✅ حذف logout من dependencies عشان ما يعيد التشغيل

  const login = (data) => {
    // ❌ لا نمسح أي شيء هنا
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
