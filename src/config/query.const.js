export const QUERY_KEYS = {
  AUTH: {
    LOGIN: "login",
    SIGNUP: "signup",
    VERIFY_EMAIL_OTP: "verify-otp",
    RESEND_EMAIL_OTP: "resend-otp",
    FORGOT_PASSWORD: "forgot-password",
    CHANGE_PASSWORD: "change-password",
    PROFILE: "profile",
    GOOGLE_LOGIN: "google-login",
  },
  ADMINS_USERS: {
    GET_ALL_USERS: "get-all-users",
    GET_ALL_ADMIN: "get-all-admin",
  },
  INVOICE: {
    GET_ALL_INVOICES: "get-all-invoices",
  },
  DASHBOARD: {
    GET_DASHBOARD: "get-dashboard",
  },
};

export const QUERY_METHODS = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  PATCH: "patch",
};
