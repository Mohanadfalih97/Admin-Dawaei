import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const logout = useCallback(() => {
    ["token", "memberID", "userEmail", "chakra-ui-color-mode" ,"userName","userRole","userId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setUser(null);
    navigate("/LoginAsMember");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const memberID = localStorage.getItem("memberID");

    if (token && memberID) {
      setUser({ token, memberID });
    } else {
      logout();
    }
  }, [logout]); // ✅ الآن ESLint لن يعطيك تحذير

  const login = (data) => {
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

