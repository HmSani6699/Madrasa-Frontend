import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const adminService = {
  getUsers: async () => {
    const response = await axiosInstance.get(endpoints.admin.users);
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`${endpoints.admin.users}/${id}`, userData);
    return response.data;
  },

  getMadrasas: async () => {
    const response = await axiosInstance.get(endpoints.admin.madrasas);
    return response.data;
  },

  createMadrasa: async (madrasaData) => {
    const response = await axiosInstance.post(endpoints.admin.madrasas, madrasaData);
    return response.data;
  },

  updateMadrasa: async (id, madrasaData) => {
    const response = await axiosInstance.put(`${endpoints.admin.madrasas}/${id}`, madrasaData);
    return response.data;
  },

  deleteMadrasa: async (id) => {
    const response = await axiosInstance.delete(`${endpoints.admin.madrasas}/${id}`);
    return response.data;
  },

  getPlans: async () => {
    const response = await axiosInstance.get(endpoints.admin.plans);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await axiosInstance.post(endpoints.admin.plans, planData);
    return response.data;
  },

  updatePlan: async (id, planData) => {
    const response = await axiosInstance.put(`${endpoints.admin.plans}/${id}`, planData);
    return response.data;
  },

  deletePlan: async (id) => {
    const response = await axiosInstance.delete(`${endpoints.admin.plans}/${id}`);
    return response.data;
  },

  getSmsRates: async () => {
    const response = await axiosInstance.get(endpoints.admin.smsRates);
    return response.data;
  },

  updateSmsRates: async (ratesData) => {
    const response = await axiosInstance.put(endpoints.admin.smsRates, ratesData);
    return response.data;
  },

  getSmsRecharges: async () => {
    const response = await axiosInstance.get(endpoints.admin.smsRecharges);
    return response.data;
  },

  processSmsRecharge: async (id, status) => {
    const response = await axiosInstance.put(`${endpoints.admin.smsRecharges}/${id}`, { status });
    return response.data;
  }
};

export default adminService;
