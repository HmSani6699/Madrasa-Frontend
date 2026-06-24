const endpoints = {
  auth: {
    login: '/auth/v1/login',
    refreshToken: '/auth/v1/refresh-token',
    logout: '/auth/v1/logout',
    me: '/auth/v1/me',
  },
  admin: {
    users: '/v1/users',
    madrasas: '/super-admin/v1/madrasas',
    plans: '/super-admin/v1/plans',
    smsRecharges: '/super-admin/v1/sms/recharges',
    smsRates: '/super-admin/v1/sms/rates',
  },
  teacher: {
    students: '/v1/students',
    attendance: '/v1/attendance/student',
    attendanceReport: '/v1/attendance/report',
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
    smsBalance: '/sms/balance',
    smsRechargeRequest: '/sms/recharge-request',
    smsRecharges: '/sms/recharges',
    smsBroadcast: '/sms/broadcast',
  }
};

export default endpoints;
