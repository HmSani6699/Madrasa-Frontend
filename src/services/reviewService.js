import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const reviewService = {
  getPublicReviews: async () => {
    const response = await axiosInstance.get(endpoints.reviews.publicList);
    return response.data;
  }
};

export default reviewService;
