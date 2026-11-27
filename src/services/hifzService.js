import axiosInstance from "../api/axiosInstance";

const BASE = "/hifz/v1";

const hifzService = {
  getSettings: async () => {
    const res = await axiosInstance.get(`${BASE}/settings`);
    return res.data;
  },
  updateSettings: async (hifz_class_ids) => {
    const res = await axiosInstance.put(`${BASE}/settings`, { hifz_class_ids });
    return res.data;
  },
  getDashboard: async (date) => {
    const res = await axiosInstance.get(`${BASE}/dashboard`, {
      params: date ? { date } : {},
    });
    return res.data;
  },
  getDailyEntries: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/daily-entries`, { params });
    return res.data;
  },
  saveDailyEntriesBulk: async (payload) => {
    const res = await axiosInstance.post(`${BASE}/daily-entries/bulk`, payload);
    return res.data;
  },
  getWeeklyKhata: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/weekly-khata`, { params });
    return res.data;
  },
  saveWeeklyKhata: async (payload) => {
    const res = await axiosInstance.put(`${BASE}/weekly-khata`, payload);
    return res.data;
  },
  getMonthlyReport: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/monthly-report`, { params });
    return res.data;
  },
  getPrintData: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/print-data`, { params });
    return res.data;
  },
  getPortalKhata: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/portal/khata`, { params });
    return res.data;
  },
  getPortalPrintData: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/portal/print-data`, { params });
    return res.data;
  },
};

export default hifzService;
