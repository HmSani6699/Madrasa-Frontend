import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const accountantService = {
  collectFee: async (feeData) => {
    const response = await axiosInstance.post(endpoints.accountant.collectFee, feeData);
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

  getStudents: async () => {
    const response = await axiosInstance.get(endpoints.teacher.students);
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
    const response = await axiosInstance.get('/class/v1/classes');
    return response.data;
  }
};

export default accountantService;
