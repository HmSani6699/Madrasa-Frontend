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
  }
};

export default portalService;
