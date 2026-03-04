import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const talimatService = {
  createExam: async (examData) => {
    const response = await axiosInstance.post(endpoints.talimat.exams, examData);
    return response.data;
  },

  enterResult: async (resultData) => {
    const response = await axiosInstance.post(endpoints.talimat.results, resultData);
    return response.data;
  },

  getExamResults: async (examId) => {
    const response = await axiosInstance.get(`${endpoints.talimat.results}/${examId}`);
    return response.data;
  }
};

export default talimatService;
