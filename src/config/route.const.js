export const ROUTES = {
    ADMIN : {
        LOGIN: '/login',
        SIGNUP: '/signup',
        VERIFY_OTP: '/verify-otp',
        FORGET_PASSWORD: '/forget-password',
        CHANGE_PASSWORD: '/change-password',
        VERIFICATION_SUCCESS: '/verification-success'
    },
    DASHBOARD : {
        HOME: '/',
        USERS: '/users',
        ADMINS: "/admins",
        SUPPORT_TICKET: "/support-tickets",
        INVOICES: "/invoices"
    },
    // USER: {
    //     // HOME: '/',
    //     LOGIN: '/login',
    //     SIGNUP: '/signup',
    //     VERIFY_OTP: '/verify-otp',
    //     FORGET_PASSWORD: '/forget-password',
    //     CHANGE_PASSWORD: '/change-password',
    //     SUCCESS: '/success'
    // },
    ERROR: {
        PAGE_NOT_FOUND: '*',
        SERVER_ERROR: '/server-error'
    }
}
