import axiosInstance from '../api/axiosInstance';
import endpoints from '../api/endpoints';

const teacherService = {
  getStudents: async () => {
    const response = await axiosInstance.get(endpoints.teacher.students);
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await axiosInstance.post(endpoints.teacher.attendance, attendanceData);
    return response.data;
  },

  getStudentAttendance: async (params) => {
    const response = await axiosInstance.get(endpoints.teacher.attendanceReport, { params });
    return response.data;
  }
};

export default teacherService;
