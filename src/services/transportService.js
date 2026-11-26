import axiosInstance from "../api/axiosInstance";

const BASE = "/transport/v1";

const transportService = {
  // Dashboard KPI & summary
  getDashboard: async (date) => {
    const res = await axiosInstance.get(`${BASE}/dashboard`, { params: date ? { date } : {} });
    return res.data;
  },

  // Vehicles & Drivers
  getVehicles: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/vehicles`, { params });
    return res.data;
  },
  createVehicle: async (data) => {
    const res = await axiosInstance.post(`${BASE}/vehicles`, data);
    return res.data;
  },
  updateVehicle: async (id, data) => {
    const res = await axiosInstance.put(`${BASE}/vehicles/${id}`, data);
    return res.data;
  },
  deleteVehicle: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/vehicles/${id}`);
    return res.data;
  },

  // Routes & Stoppages
  getRoutes: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/routes`, { params });
    return res.data;
  },
  createRoute: async (data) => {
    const res = await axiosInstance.post(`${BASE}/routes`, data);
    return res.data;
  },
  updateRoute: async (id, data) => {
    const res = await axiosInstance.put(`${BASE}/routes/${id}`, data);
    return res.data;
  },
  deleteRoute: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/routes/${id}`);
    return res.data;
  },

  // Admission & Transport Students
  getAdmissionStudents: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/admission-students`, { params });
    return res.data;
  },
  getTransportStudents: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/students`, { params });
    return res.data;
  },
  enrollStudent: async (data) => {
    const res = await axiosInstance.post(`${BASE}/students`, data);
    return res.data;
  },
  bulkEnrollStudents: async (data) => {
    const res = await axiosInstance.post(`${BASE}/students/bulk`, data);
    return res.data;
  },
  updateTransportStudent: async (id, data) => {
    const res = await axiosInstance.put(`${BASE}/students/${id}`, data);
    return res.data;
  },
  deleteTransportStudent: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/students/${id}`);
    return res.data;
  },

  // Daily Pickup & Drop Roster
  getDailyTrips: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/daily-trips`, { params });
    return res.data;
  },
  updateTripStatus: async (data) => {
    const res = await axiosInstance.patch(`${BASE}/daily-trips/status`, data);
    return res.data;
  },
  bulkUpdateTripStatus: async (data) => {
    const res = await axiosInstance.post(`${BASE}/daily-trips/bulk-status`, data);
    return res.data;
  },

  // Fuel & Maintenance Expenses
  getExpenses: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/expenses`, { params });
    return res.data;
  },
  createExpense: async (data) => {
    const res = await axiosInstance.post(`${BASE}/expenses`, data);
    return res.data;
  },
  deleteExpense: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/expenses/${id}`);
    return res.data;
  },

  // Monthly Transport Billing
  getBills: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/bills`, { params });
    return res.data;
  },
  generateMonthlyBills: async (data) => {
    const res = await axiosInstance.post(`${BASE}/bills/generate`, data);
    return res.data;
  },
  collectBillPayment: async (id, data) => {
    const res = await axiosInstance.post(`${BASE}/bills/${id}/collect`, data);
    return res.data;
  },
};

export default transportService;
