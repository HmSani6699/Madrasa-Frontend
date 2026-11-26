import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  /* General State */
  const [user, setUser] = useState(null);
  const [madrasas, setMadrasas] = useState([]);
  const [currentMadrasa, setCurrentMadrasa] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Guardian Specific State */
  const [guardianChildren, setGuardianChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);

  const syncGuardianChildren = (children) => {
    if (!Array.isArray(children)) return;
    setGuardianChildren(children);
    localStorage.setItem("guardianChildren", JSON.stringify(children));

    let storedActiveId = null;
    try {
      const storedActive = JSON.parse(localStorage.getItem("activeChild") || "null");
      storedActiveId = storedActive?.id || null;
    } catch {
      storedActiveId = null;
    }

    const nextActive =
      (storedActiveId && children.find((c) => c.id === storedActiveId)) ||
      children[0] ||
      null;

    setActiveChild(nextActive);
    if (nextActive) {
      localStorage.setItem("activeChild", JSON.stringify(nextActive));
    } else {
      localStorage.removeItem("activeChild");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");
      
      if (accessToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }

        try {
          const profileRes = await authService.getCurrentUser();
          if (profileRes.success) {
            setUser(profileRes.data.user);
            setCurrentMadrasa(profileRes.data.madrasa);
            if (Array.isArray(profileRes.data.guardianChildren)) {
              syncGuardianChildren(profileRes.data.guardianChildren);
            }
          }
        } catch (err) {
          console.warn("Session check or tenant context load failed:", err?.message || err);
          // If token verification failed, clear user state quietly so public pages render cleanly
          setUser(null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      } else if (refreshToken) {
        // Optionally try to refresh if only refresh token exists
        try {
           const data = await authService.refreshToken(refreshToken);
           if (data.success) {
              const freshUser = localStorage.getItem("user");
              if (freshUser) setUser(JSON.parse(freshUser));
              const profileRes = await authService.getCurrentUser();
              if (profileRes.success) {
                setUser(profileRes.data.user);
                setCurrentMadrasa(profileRes.data.madrasa);
                if (Array.isArray(profileRes.data.guardianChildren)) {
                  syncGuardianChildren(profileRes.data.guardianChildren);
                }
              }
           }
        } catch (err) {
           setUser(null);
           localStorage.removeItem("accessToken");
           localStorage.removeItem("refreshToken");
           localStorage.removeItem("user");
        }
      }

      const storedMadrasas = localStorage.getItem("madrasas");
      const storedCurrentMadrasa = localStorage.getItem("currentMadrasa");
      const storedChildren = localStorage.getItem("guardianChildren");
      const storedActiveChild = localStorage.getItem("activeChild");

      if (storedMadrasas) {
        try { setMadrasas(JSON.parse(storedMadrasas)); } catch { localStorage.removeItem("madrasas"); }
      }
      if (storedCurrentMadrasa && !currentMadrasa) {
        try { setCurrentMadrasa(JSON.parse(storedCurrentMadrasa)); } catch { localStorage.removeItem("currentMadrasa"); }
      }
      if (storedChildren) {
        try {
          const parsedChildren = JSON.parse(storedChildren);
          setGuardianChildren((prev) => (prev.length > 0 ? prev : parsedChildren));
        } catch {
          localStorage.removeItem("guardianChildren");
        }
      }
      if (storedActiveChild) {
        try {
          const parsedActive = JSON.parse(storedActiveChild);
          setActiveChild((prev) => prev || parsedActive);
        } catch {
          localStorage.removeItem("activeChild");
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await authService.login(identifier, password);
      if (response.success) {
        const { user: userData, guardianChildren: loginChildren } = response.data;
        setUser(userData);
        if (Array.isArray(loginChildren)) {
          syncGuardianChildren(loginChildren);
        }
        
        try {
          const profileRes = await authService.getCurrentUser();
          if (profileRes.success) {
            setUser(profileRes.data.user);
            setCurrentMadrasa(profileRes.data.madrasa);
            if (Array.isArray(profileRes.data.guardianChildren)) {
              syncGuardianChildren(profileRes.data.guardianChildren);
            }
          }
        } catch (profileErr) {
          console.error("Failed to load madrasa info after login:", profileErr);
        }
        
        return userData;
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setMadrasas([]);
    setCurrentMadrasa(null);
    setGuardianChildren([]);
    setActiveChild(null);
  };

  const selectMadrasa = (madrasa) => {
    setCurrentMadrasa(madrasa);
    localStorage.setItem("currentMadrasa", JSON.stringify(madrasa));
  };
  
  const selectChild = (child) => {
     setActiveChild(child);
     localStorage.setItem("activeChild", JSON.stringify(child));
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        loading, 
        madrasas, 
        currentMadrasa, 
        selectMadrasa,
        guardianChildren,
        activeChild,
        selectChild
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
