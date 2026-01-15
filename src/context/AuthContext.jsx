import { createContext, useContext, useState, useEffect } from "react";

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
    // Check for stored user/token on mount
    const storedUser = localStorage.getItem("user");
    const storedMadrasas = localStorage.getItem("madrasas");
    const storedCurrentMadrasa = localStorage.getItem("currentMadrasa");
    
    // Guardian stored data
    const storedChildren = localStorage.getItem("guardianChildren");
    const storedActiveChild = localStorage.getItem("activeChild");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedMadrasas) {
      setMadrasas(JSON.parse(storedMadrasas));
    }
    if (storedCurrentMadrasa) {
      setCurrentMadrasa(JSON.parse(storedCurrentMadrasa));
    }
    
    // Restore Guardian State
    if (storedChildren) {
       setGuardianChildren(JSON.parse(storedChildren));
    }
    if (storedActiveChild) {
       setActiveChild(JSON.parse(storedActiveChild));
    }

    setLoading(false);
  }, []);

  const login = (userData, madrasaList = [], childrenList = []) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (madrasaList.length > 0) {
      setMadrasas(madrasaList);
      localStorage.setItem("madrasas", JSON.stringify(madrasaList));
      // Default to first madrasa if none selected
      setCurrentMadrasa(madrasaList[0]);
      localStorage.setItem("currentMadrasa", JSON.stringify(madrasaList[0]));
    }
    
    // Guardian Login Handling
    if (userData.role === 'guardian' && childrenList.length > 0) {
       setGuardianChildren(childrenList);
       localStorage.setItem("guardianChildren", JSON.stringify(childrenList));
       setActiveChild(childrenList[0]);
       localStorage.setItem("activeChild", JSON.stringify(childrenList[0]));
    }
  };

  const selectMadrasa = (madrasa) => {
    setCurrentMadrasa(madrasa);
    localStorage.setItem("currentMadrasa", JSON.stringify(madrasa));
  };
  
  const selectChild = (child) => {
     setActiveChild(child);
     localStorage.setItem("activeChild", JSON.stringify(child));
  };

  const logout = () => {
    setUser(null);
    setMadrasas([]);
    setCurrentMadrasa(null);
    setGuardianChildren([]);
    setActiveChild(null);
    localStorage.removeItem("user");
    localStorage.removeItem("madrasas");
    localStorage.removeItem("currentMadrasa");
    localStorage.removeItem("guardianChildren");
    localStorage.removeItem("activeChild");
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
