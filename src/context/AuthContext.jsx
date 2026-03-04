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

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");
      
      if (accessToken && storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (refreshToken) {
        // Optionally try to refresh if only refresh token exists
        try {
           const data = await authService.refreshToken(refreshToken);
           if (data.success) {
              const freshUser = localStorage.getItem("user");
              if (freshUser) setUser(JSON.parse(freshUser));
           }
        } catch (err) {
           logout();
        }
      }

      const storedMadrasas = localStorage.getItem("madrasas");
      const storedCurrentMadrasa = localStorage.getItem("currentMadrasa");
      const storedChildren = localStorage.getItem("guardianChildren");
      const storedActiveChild = localStorage.getItem("activeChild");

      if (storedMadrasas) setMadrasas(JSON.parse(storedMadrasas));
      if (storedCurrentMadrasa) setCurrentMadrasa(JSON.parse(storedCurrentMadrasa));
      if (storedChildren) setGuardianChildren(JSON.parse(storedChildren));
      if (storedActiveChild) setActiveChild(JSON.parse(storedActiveChild));

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await authService.login(identifier, password);
      if (response.success) {
        const { user: userData } = response.data;
        setUser(userData);
        // Handling madrasas and guardian children if they are in the login response
        // If not, they might be fetched separately. Based on backend, data.user is returned.
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
