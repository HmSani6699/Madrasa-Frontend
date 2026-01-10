import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [madrasas, setMadrasas] = useState([]);
  const [currentMadrasa, setCurrentMadrasa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user/token on mount
    const storedUser = localStorage.getItem("user");
    const storedMadrasas = localStorage.getItem("madrasas");
    const storedCurrentMadrasa = localStorage.getItem("currentMadrasa");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedMadrasas) {
      setMadrasas(JSON.parse(storedMadrasas));
    }
    if (storedCurrentMadrasa) {
      setCurrentMadrasa(JSON.parse(storedCurrentMadrasa));
    }
    setLoading(false);
  }, []);

  const login = (userData, madrasaList = []) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (madrasaList.length > 0) {
      setMadrasas(madrasaList);
      localStorage.setItem("madrasas", JSON.stringify(madrasaList));
      // Default to first madrasa if none selected
      setCurrentMadrasa(madrasaList[0]);
      localStorage.setItem("currentMadrasa", JSON.stringify(madrasaList[0]));
    }
  };

  const selectMadrasa = (madrasa) => {
    setCurrentMadrasa(madrasa);
    localStorage.setItem("currentMadrasa", JSON.stringify(madrasa));
  };

  const logout = () => {
    setUser(null);
    setMadrasas([]);
    setCurrentMadrasa(null);
    localStorage.removeItem("user");
    localStorage.removeItem("madrasas");
    localStorage.removeItem("currentMadrasa");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, madrasas, currentMadrasa, selectMadrasa }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
