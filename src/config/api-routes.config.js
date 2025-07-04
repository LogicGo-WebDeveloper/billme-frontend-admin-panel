export const DOMAIN = "https://api.mint-invoice.com";
export const ADMIN = "admin";
export const USER = "api";
export const VERSION_V1 = "v1";

export const API_USER = `${DOMAIN}/${USER}/${VERSION_V1}`;
export const API_ADMIN = `${DOMAIN}/${ADMIN}`;

export const ROUTE_PATH = {
  AUTH: {
    LOGIN: `${API_ADMIN}/auth/login/email`,
    SIGNUP: `${API_ADMIN}/auth/register/email`,
    VERIFY_EMAIL_OTP: `${API_ADMIN}/auth/verify/email/otp`,
    RESEND_EMAIL_OTP: `${API_ADMIN}/auth/resend/otp/email`,
    FORGOT_PASSWORD: `${API_ADMIN}/auth/forgot-password/email`,
    CHANGE_PASSWORD: `${API_ADMIN}/auth/reset-password`,
    GOOGLE_LOGIN: `${API_ADMIN}/auth/google-login`,
  },
  // USER : {
  //     PROFILE : `${API_ADMIN}/user/profile`,
  //     UPDATE_PROFILE : `${API_ADMIN}/user/profile`
  // },
  ADMINS_USERS: {
    GET_USERS: `${API_ADMIN}/admin-user/app-users`,
    GET_ADMINS: `${API_ADMIN}/admin-user/all-admin-users`,
    UPDATE_ADMIN_STATUS: `${API_ADMIN}/admin-user/update-status-approved-or-rejected`,
  },
  INVOICE: {
    GET_ALL_INVOICES: `${API_ADMIN}/invoices/list`,
    GET_INVOICES_BY_USER: `${API_ADMIN}/invoices/user`,
  },
  DASHBOARD: {
    GET_DASHBOARD: `${API_ADMIN}/dashboard`,
  },
  SUPPORT_REQUEST: {
    GET_ALL_TICKETS: `${API_ADMIN}/support-request`,
    REPLY_TO_TICKET: (ticketId) => `${API_ADMIN}/support-request/${ticketId}/reply`,
  }
};
