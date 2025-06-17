import React from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircleFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import AuthLayout from '../../components/auth-layout';
import { ROUTES } from '../../config/route.const';
import PrimaryButton from '../../components/common/primary.button';

const VerificationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};

  if (!email) {
    return <Navigate to={ROUTES.ADMIN.SIGNUP} replace />;
  }

  const maskedEmail = email.replace(/^(.{2}).+(@.+)$/, "$1****$2");

  return (
    <AuthLayout>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm text-center mt-16 mx-auto"
      >
        <div className="mb-8">
          <CheckCircleFilled className="text-[#01B763] text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-[#122751] mb-3">Email Verified Successfully!</h2>
          <p className="text-[#8D94A3] mb-2">
            Your email has been verified. We're now waiting for the Super Admin to approve your account.
          </p>
          <p className="text-sm text-[#122751] font-medium mb-6">Verified Email: {maskedEmail}</p>

          <div className="bg-[#F8F9FA] p-4 rounded-lg text-left">
            <p className="text-sm text-[#122751] mb-2 font-medium">What happens next?</p>
            <ul className="text-sm text-[#8D94A3] space-y-2">
              <li className="flex items-start">
                <span className="text-[#01B763] mr-2">•</span>
                Super Admin will review your account
              </li>
              <li className="flex items-start">
                <span className="text-[#01B763] mr-2">•</span>
                You'll receive an email once approved
              </li>
              <li className="flex items-start">
                <span className="text-[#01B763] mr-2">•</span>
                Then you can log in to your account
              </li>
            </ul>
          </div>

          {/* Waiting for Approval Button */}
          <button
            disabled
            className="mt-6 w-full bg-gray-200 text-gray-500 py-2 px-4 rounded"
          >
            Waiting for Approval
          </button>

          {/* Back to Login */}
          <PrimaryButton
            onClick={() => navigate(ROUTES.ADMIN.LOGIN)}
            type="button"
            className="mt-4 text-sm text-[#2363E3] font-medium"
          >
            Back to Login
          </PrimaryButton>
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default VerificationSuccess;
