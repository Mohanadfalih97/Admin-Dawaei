import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // دالة تسجيل الخروج مع useCallback
  const logout = useCallback(() => {
    // مسح جميع بيانات الكاش المخزنة
    ["token", "memberID", "userEmail", "chakra-ui-color-mode", "userName", "userRole", "userId"].forEach((key) =>
      localStorage.removeItem(key)
    );
    setUser(null);
    navigate("/Login"); // الانتقال إلى صفحة تسجيل الدخول
  }, [navigate]); // التأكد من إضافة navigate إلى التبعيات

  // useEffect للتحقق من البيانات المخزنة عند التحميل
  useEffect(() => {
    const token = localStorage.getItem("token");

    // إذا لم يكن التوكن أو العضو موجودًا في الكاش، قم بتسجيل الخروج مباشرة
    if (!token) {
      logout();
    } else {
      // إذا كانت البيانات موجودة، قم بتعيين المستخدم
      setUser({ token });
    }
  }, [logout]); // استخدام logout فقط كتبعيات

  const login = (data) => {
    // تخزين بيانات المستخدم في localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userEmail", data.userEmail);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("userRole", data.userRole);
    setUser(data); // تعيين المستخدم
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
