import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const accountantService = {
  collectFee: async (feeData) => {
    const response = await axiosInstance.post(endpoints.accountant.collectFee, feeData);
    return response.data;
  },

  getPendingFees: async (studentId) => {
    const response = await axiosInstance.get(endpoints.accountant.getPendingFees(studentId));
    return response.data;
  },

  generateFees: async (data) => {
    const response = await axiosInstance.post(endpoints.accountant.generateFees, data);
    return response.data;
  },

  getAccounts: async () => {
    const response = await axiosInstance.get(endpoints.accountant.getAccounts);
    return response.data;
  },

  addDonation: async (donationData) => {
    const response = await axiosInstance.post(endpoints.accountant.donations, donationData);
    return response.data;
  },

  getDonations: async () => {
    const response = await axiosInstance.get(endpoints.accountant.donations);
    return response.data;
  },

  getStudents: async (params = {}) => {
    const response = await axiosInstance.get(endpoints.teacher.students, { params });
    return response.data;
  },

  getStudentFeeHistory: async (studentId) => {
    const response = await axiosInstance.get(`/fee-management/v1/student-history/${studentId}`);
    return response.data;
  },

  voidTransaction: async (transactionId, reason = '') => {
    const response = await axiosInstance.post(`/fee-management/v1/void-transaction/${transactionId}`, { reason });
    return response.data;
  },

  getFeeTypes: async () => {
    const response = await axiosInstance.get('/fee-type/v1');
    return response.data;
  },

  processSalary: async (salaryData) => {
    const response = await axiosInstance.post(endpoints.accountant.salaryProcess, salaryData);
    return response.data;
  },

  // Fee Setup
  getFeeHeads: async () => {
    const response = await axiosInstance.get(endpoints.accountant.feeHeads);
    return response.data;
  },
  createFeeHead: async (data) => {
    const response = await axiosInstance.post(endpoints.accountant.feeHeads, data);
    return response.data;
  },
  updateFeeHead: async (id, data) => {
    const response = await axiosInstance.put(`${endpoints.accountant.feeHeads}/${id}`, data);
    return response.data;
  },
  deleteFeeHead: async (id) => {
    const response = await axiosInstance.delete(`${endpoints.accountant.feeHeads}/${id}`);
    return response.data;
  },
  getFeeSetups: async (headId) => {
    const response = await axiosInstance.get(`${endpoints.accountant.feeSetups}/${headId}`);
    return response.data;
  },
  bulkUpdateFeeSetups: async (data) => {
    const response = await axiosInstance.post(`${endpoints.accountant.feeSetups}/bulk`, data);
    return response.data;
  },
  getClasses: async () => {
    const response = await axiosInstance.get(endpoints.common.classes);
    return response.data;
  }
};

export default accountantService;
