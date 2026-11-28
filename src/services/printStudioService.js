import axiosInstance from "../api/axiosInstance";

const printStudioService = {
  // Print Templates CRUD
  getTemplates: async (params = {}) => {
    const res = await axiosInstance.get("/print-templates", { params });
    return res.data;
  },
  createTemplate: async (payload) => {
    const res = await axiosInstance.post("/print-templates", payload);
    return res.data;
  },
  updateTemplate: async (id, payload) => {
    const res = await axiosInstance.put(`/print-templates/${id}`, payload);
    return res.data;
  },
  setDefaultTemplate: async (id) => {
    const res = await axiosInstance.patch(`/print-templates/${id}/default`);
    return res.data;
  },
  deleteTemplate: async (id) => {
    const res = await axiosInstance.delete(`/print-templates/${id}`);
    return res.data;
  },

  // Card & Admit Data
  getStudentCardsData: async (params = {}) => {
    const res = await axiosInstance.get("/cards/students", { params });
    return res.data;
  },
  getStaffCardsData: async (params = {}) => {
    const res = await axiosInstance.get("/cards/staff", { params });
    return res.data;
  },
  getAdmitCardData: async (params = {}) => {
    const res = await axiosInstance.get("/cards/admit-data", { params });
    return res.data;
  },

  // Certificates
  getCertificates: async (params = {}) => {
    const res = await axiosInstance.get("/certificates", { params });
    return res.data;
  },
  issueCertificate: async (payload) => {
    const res = await axiosInstance.post("/certificates", payload);
    return res.data;
  },
  bulkIssueCertificates: async (payload) => {
    const res = await axiosInstance.post("/certificates/bulk", payload);
    return res.data;
  },
  deleteCertificate: async (id) => {
    const res = await axiosInstance.delete(`/certificates/${id}`);
    return res.data;
  },

  // Supporting Lookups
  getClasses: async () => {
    const res = await axiosInstance.get("/v1/classes");
    return res.data;
  },
  getSections: async (classId = "") => {
    const res = await axiosInstance.get("/v1/sections", {
      params: classId ? { class_id: classId } : {},
    });
    return res.data;
  },
  getExamNames: async () => {
    const res = await axiosInstance.get("/v1/exam-names");
    return res.data;
  },
  getDesignations: async () => {
    const res = await axiosInstance.get("/v1/designations");
    return res.data;
  },
};

export default printStudioService;
