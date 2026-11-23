import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const additionalService = {
  getPublicAdditionalServices: async () => {
    const response = await axiosInstance.get(endpoints.additionalServices.publicList);
    return response.data;
  }
};

export default additionalService;
