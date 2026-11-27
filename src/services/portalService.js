import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const portalService = {
  getFinancialOverview: async () => {
    const response = await axiosInstance.get(endpoints.mohtamim.financeOverview);
    return response.data;
  },

  getStudentStats: async () => {
    const response = await axiosInstance.get(endpoints.mohtamim.studentStats);
    return response.data;
  },

  getStudentPortalData: async (id) => {
    const response = await axiosInstance.get(endpoints.portal.studentData(id));
    return response.data;
  },

  getSmsBalance: async () => {
    const response = await axiosInstance.get(endpoints.portal.smsBalance);
    return response.data;
  },

  submitSmsRecharge: async (rechargeData) => {
    const response = await axiosInstance.post(endpoints.portal.smsRechargeRequest, rechargeData);
    return response.data;
  },

  getSmsRecharges: async () => {
    const response = await axiosInstance.get(endpoints.portal.smsRecharges);
    return response.data;
  },

  broadcastSms: async (broadcastData) => {
    const response = await axiosInstance.post(endpoints.portal.smsBroadcast, broadcastData);
    return response.data;
  },

  getSmsSettings: async () => {
    const response = await axiosInstance.get(endpoints.portal.smsSettings);
    return response.data;
  },

  updateSmsSettings: async (settingsData) => {
    const response = await axiosInstance.put(endpoints.portal.smsSettings, settingsData);
    return response.data;
  },

  getSmsLogs: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.portal.smsLogs, { params });
    return response.data;
  }
};

export default portalService;
