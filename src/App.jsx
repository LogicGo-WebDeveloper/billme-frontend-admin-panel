import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./config/route.const";
import Login from "./pages/auth/login.jsx";
import Signup from "./pages/auth/signup.jsx";
import VerifyOtp from "./pages/auth/verify-otp/VerifyOtp.jsx";
import ForgetPassword from "./pages/auth/forget-password.jsx";
import ChangePassword from "./pages/auth/change-password.jsx";
import VerificationSuccess from "./pages/auth/verificatoin-success.jsx";
import Home from "./pages/dashboard/home.jsx";
import Users from "./pages/dashboard/users.jsx";
import Admins from "./pages/dashboard/admins.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import SupportTickets from "./pages/dashboard/support-tickets.jsx";
import Invoices from "./pages/dashboard/invoices.jsx";
import InvoicePreview from "./pages/dashboard/invoicePreview.jsx";
import AuthorizePages from "./components/authorizePages.jsx";
import UnAuthorizePages from "./components/unAuthorizePages.jsx";
import ErrorPage from './pages/dashboard/error-page.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        {/* Auth Routes */}
        {/* <Route element={<UnAuthorizePages />}> */}
        <Route path={ROUTES.ADMIN.LOGIN} element={<Login />} />
        <Route path={ROUTES.ADMIN.SIGNUP} element={<Signup />} />
        <Route path={ROUTES.ADMIN.VERIFY_OTP} element={<VerifyOtp />} />
        <Route
          path={ROUTES.ADMIN.FORGET_PASSWORD}
          element={<ForgetPassword />}
        />
        <Route
          path={ROUTES.ADMIN.CHANGE_PASSWORD}
          element={<ChangePassword />}
        />
        <Route
          path={ROUTES.ADMIN.VERIFICATION_SUCCESS}
          element={<VerificationSuccess />}
        />
        {/* </Route> */}

        {/* Dashboard Routes inside layout */}

        <Route element={<AuthorizePages />}>
          <Route path="/" element={<Home />}>
            <Route path={ROUTES.DASHBOARD.HOME} element={<Dashboard />} />
            <Route path={ROUTES.DASHBOARD.USERS} element={<Users />} />
            <Route path={ROUTES.DASHBOARD.ADMINS} element={<Admins />} />
            <Route
              path={ROUTES.DASHBOARD.SUPPORT_TICKET}
              element={<SupportTickets />}
            />
            <Route path={ROUTES.DASHBOARD.INVOICES} element={<Invoices />} />
          </Route>
          <Route
            path={ROUTES.DASHBOARD.INVOICE_PREVIEW}
            element={<InvoicePreview />}
          />
        </Route>

        {/* Error Routes */}
        <Route
          path={ROUTES.ERROR.PAGE_NOT_FOUND}
          element={
            <ErrorPage
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              buttonText="Back Home"
            />
          }
        />
        <Route
          path={ROUTES.ERROR.SERVER_ERROR}
          element={
            <ErrorPage
              status="500"
              title="500"
              subTitle="Sorry, something went wrong."
              buttonText="Back Home"
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
