import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const authService = {
  login: async (identifier, password) => {
    // Backend expects 'email' or 'username'. Sending both to cover both bases.
    const response = await axiosInstance.post(endpoints.auth.login, { 
      email: identifier, 
      username: identifier, 
      password 
    });

    console.log(response);
    

    if (response.data.success && response.data.data.accessToken) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post(endpoints.auth.refreshToken, { refreshToken });
    if (response.data.success && response.data.accessToken) {
       localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await axiosInstance.post(endpoints.auth.logout, { refreshToken });
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("currentMadrasa");
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get(endpoints.auth.me);
    if (response.data.success && response.data.data.madrasa) {
      localStorage.setItem("currentMadrasa", JSON.stringify(response.data.data.madrasa));
    }
    return response.data;
  },
};

export default authService;
