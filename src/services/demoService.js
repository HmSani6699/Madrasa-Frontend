import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const demoService = {
  submitDemoRequest: async (formData) => {
    const response = await axiosInstance.post(endpoints.demo.submit, formData);
    return response.data;
  },
  getDemoVideo: async () => {
    const response = await axiosInstance.get(endpoints.demo.video);
    return response.data;
  }
};

export default demoService;
