import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const contactService = {
  submitMessage: async (formData) => {
    const response = await axiosInstance.post(endpoints.contact.submit, formData);
    return response.data;
  }
};

export default contactService;
