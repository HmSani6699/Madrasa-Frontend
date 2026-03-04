const endpoints = {
  auth: {
    login: '/auth/v1/login',
    refreshToken: '/auth/v1/refresh-token',
    logout: '/auth/v1/logout',
  },
  admin: {
    users: '/v1/users',
    madrasas: '/super-admin/v1/madrasas',
  },
  teacher: {
    students: '/v1/students',
    attendance: '/v1/attendance',
  },
  accountant: {
    collectFee: '/v1/fees/collect',
    donations: '/v1/donations',
    salaryProcess: '/v1/salary/process',
    feeHeads: '/fee-setup/v1/heads',
    feeSetups: '/fee-setup/v1/setups',
  },
  talimat: {
    exams: '/v1/exams',
    results: '/v1/results',
  },
  mohtamim: {
    financeOverview: '/v1/finance/overview',
    studentStats: '/v1/students/stats',
  },
  portal: {
    studentData: (id) => `/v1/portal/student/${id}`,
  }
};

export default endpoints;
