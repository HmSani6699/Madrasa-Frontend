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
  },

  getDemoRequests: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.admin.demoRequests, { params });
    return response.data;
  },

  updateDemoRequestStatus: async (id, data) => {
    const response = await axiosInstance.patch(endpoints.admin.updateDemoRequestStatus(id), data);
    return response.data;
  },

  deleteDemoRequest: async (id) => {
    const response = await axiosInstance.delete(endpoints.admin.deleteDemoRequest(id));
    return response.data;
  },

  getDemoVideoSettings: async () => {
    const response = await axiosInstance.get(endpoints.admin.demoVideoSettings);
    return response.data;
  },

  updateDemoVideoSettings: async (data) => {
    const response = await axiosInstance.put(endpoints.admin.demoVideoSettings, data);
    return response.data;
  },

  // Video Reviews Management
  getAllReviews: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.admin.reviews, { params });
    return response.data;
  },

  getReviewById: async (id) => {
    const response = await axiosInstance.get(endpoints.admin.reviewById(id));
    return response.data;
  },

  createReview: async (data) => {
    const response = await axiosInstance.post(endpoints.admin.reviews, data);
    return response.data;
  },

  updateReview: async (id, data) => {
    const response = await axiosInstance.put(endpoints.admin.reviewById(id), data);
    return response.data;
  },

  toggleReviewStatus: async (id, isActive) => {
    const response = await axiosInstance.patch(endpoints.admin.updateReviewStatus(id), { isActive });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await axiosInstance.delete(endpoints.admin.deleteReview(id));
    return response.data;
  },

  // Contact Messages Management
  getContactMessages: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.admin.contactMessages, { params });
    return response.data;
  },

  updateContactMessageStatus: async (id, data) => {
    const response = await axiosInstance.patch(endpoints.admin.updateContactMessageStatus(id), data);
    return response.data;
  },

  deleteContactMessage: async (id) => {
    const response = await axiosInstance.delete(endpoints.admin.deleteContactMessage(id));
    return response.data;
  }
};

export default adminService;
