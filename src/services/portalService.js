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
  }
};

export default portalService;
