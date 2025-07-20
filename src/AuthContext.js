import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import publicRoutes from "./router/publicrouter"; // ✅ استدعاء صحيح من الملف

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    [
      "token",
      "memberID",
      "userEmail",
      "chakra-ui-color-mode",
      "userName",
      "userRole",
      "userId",
    ].forEach((key) => localStorage.removeItem(key));
    setUser(null);
    navigate("/Login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const path = location.pathname.toLowerCase();

    // ✅ التحقق من كون المسار عامًا (حتى لو كان فيه /:id أو غيره)
    const isPublic = publicRoutes.some((route) =>
      path === route.toLowerCase() || path.startsWith(route.toLowerCase() + "/")
    );

    if (!token && !isPublic) {
      logout();
    } else if (token) {
      setUser({ token });
    }
  }, [logout, location.pathname]);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userEmail", data.userEmail);
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
