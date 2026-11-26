import axiosInstance from "../api/axiosInstance";

const BASE = "/boarding/v1";

const boardingService = {
  // Dashboard KPI & summary
  getDashboard: async (date) => {
    const res = await axiosInstance.get(`${BASE}/dashboard`, { params: date ? { date } : {} });
    return res.data;
  },

  // Admission students & Boarding students
  getAdmissionStudents: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/admission-students`, { params });
    return res.data;
  },
  getBoardingStudents: async (params = {}) => {
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
  updateBoardingStudent: async (id, data) => {
    const res = await axiosInstance.put(`${BASE}/students/${id}`, data);
    return res.data;
  },
  deleteBoardingStudent: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/students/${id}`);
    return res.data;
  },

  // Meal Schedules & Weekly Menu
  getSchedules: async () => {
    const res = await axiosInstance.get(`${BASE}/schedules`);
    return res.data;
  },
  updateSchedule: async (id, data) => {
    const res = await axiosInstance.put(`${BASE}/schedules/${id}`, data);
    return res.data;
  },

  // Daily Roster & Guest Meals
  getDailyRoster: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/daily-roster`, { params });
    return res.data;
  },
  toggleMeal: async (data) => {
    const res = await axiosInstance.patch(`${BASE}/daily-roster/toggle`, data);
    return res.data;
  },
  bulkToggleMeals: async (data) => {
    const res = await axiosInstance.post(`${BASE}/daily-roster/bulk-toggle`, data);
    return res.data;
  },
  deliverMeals: async (data) => {
    const res = await axiosInstance.post(`${BASE}/daily-roster/deliver`, data);
    return res.data;
  },
  addGuestMeal: async (data) => {
    const res = await axiosInstance.post(`${BASE}/guest-meals`, data);
    return res.data;
  },
  deleteGuestMeal: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/guest-meals/${id}`);
    return res.data;
  },

  // Bazar & Expenses
  getBazarList: async (params = {}) => {
    const res = await axiosInstance.get(`${BASE}/bazar`, { params });
    return res.data;
  },
  createBazarEntry: async (data) => {
    const res = await axiosInstance.post(`${BASE}/bazar`, data);
    return res.data;
  },
  deleteBazarEntry: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/bazar/${id}`);
    return res.data;
  },

  // Dry Inventory
  getInventory: async () => {
    const res = await axiosInstance.get(`${BASE}/inventory`);
    return res.data;
  },
  createInventoryItem: async (data) => {
    const res = await axiosInstance.post(`${BASE}/inventory`, data);
    return res.data;
  },
  updateInventoryItem: async (id, data) => {
    const res = await axiosInstance.put(`${BASE}/inventory/${id}`, data);
    return res.data;
  },
  adjustInventoryStock: async (id, data) => {
    const res = await axiosInstance.post(`${BASE}/inventory/${id}/adjust`, data);
    return res.data;
  },
  deleteInventoryItem: async (id) => {
    const res = await axiosInstance.delete(`${BASE}/inventory/${id}`);
    return res.data;
  },

  // Billing, Meal Rate & Reports
  getBills: async (month) => {
    const res = await axiosInstance.get(`${BASE}/bills`, { params: month ? { month } : {} });
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
  getKitchenSlip: async (date) => {
    const res = await axiosInstance.get(`${BASE}/reports/kitchen-slip`, { params: date ? { date } : {} });
    return res.data;
  },
  getMonthlyReport: async (month) => {
    const res = await axiosInstance.get(`${BASE}/reports/monthly`, { params: month ? { month } : {} });
    return res.data;
  },
};

export default boardingService;
