import React, { useRef, useState } from "react";
import { Form, message as antdMessage, message } from "antd";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import AuthLayout from "../../../components/auth-layout";
import PrimaryButton from "../../../components/common/primary.button";
import LoadingButton from "../../../components/common/loading-button";
import "../verify-otp/style.css";
import { ROUTES } from "../../../config/route.const";
import { ROUTE_PATH } from "../../../config/api-routes.config";
import { QUERY_KEYS, QUERY_METHODS } from "../../../config/query.const";
import { useMutate } from "../../../hooks/useQuery";
import { delay } from "../../../utils/delay";
import { CheckCircleFilled } from "@ant-design/icons";

const VerifyOtp = () => {
  const location = useLocation();
  const { email, from } = location.state || {};

  if (!email) {
    return <Navigate to={ROUTES.ADMIN.SIGNUP} replace />;
  }

  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  // const [isVerified, setIsVerified] = useState(false);

  const { mutate: verifyOtpMutation, isLoading } = useMutate(
    QUERY_KEYS.AUTH.VERIFY_EMAIL_OTP,
    QUERY_METHODS.POST,
    ROUTE_PATH.AUTH.VERIFY_EMAIL_OTP,
    {
      onSuccess: async () => {
        // await delay(1000);
        // setIsVerified(true);

        if (from === "forgot-password") {
          messageApi.success("OTP verified successfully!");
          await delay(1000);
          setShowLoader(false);
          navigate(ROUTES.ADMIN.CHANGE_PASSWORD, {
            state: {
              email,
              from: "reset-password",
            },
          });
        } else {
          // ✅ Show message before navigating
          messageApi.success("OTP verified successfully!");

          // ✅ Wait for message to show
          await delay(2000);
          setShowLoader(false);

          navigate(ROUTES.ADMIN.VERIFICATION_SUCCESS, { state: { email } });
        }
      },
      onError: (error) => {
        console.log(error);
        setShowLoader(false);
        setOtpError(true);
        setTimeout(() => setOtpError(false), 500);
        messageApi.error(
          error.response?.data?.message ||
            "OTP verification failed. Please try again."
        );
      },
    }
  );

  const { mutate: resendOtpMutation } = useMutate(
    QUERY_KEYS.AUTH.RESEND_EMAIL_OTP,
    QUERY_METHODS.POST,
    ROUTE_PATH.AUTH.RESEND_EMAIL_OTP,
    {
      onSuccess: () => {
        messageApi.success("OTP resent successfully!");
      },
      onError: (error) => {
        messageApi.error(error.response?.data?.message || "OTP resend failed.");
      },
    }
  );

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs[index - 1].current.focus();
      }
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4 || otp.includes("")) {
      setOtpError(true);
      setTimeout(() => setOtpError(false), 500);
      messageApi.error("Please enter a valid 4-digit OTP");
      return;
    }

    const payload = {
      email: email,
      otp: parseInt(otpCode),
    };

    setShowLoader(true);
    verifyOtpMutation(payload);
  };

  const handleOtpResend = () => {
    setOtp(["", "", "", ""]);
    inputRefs[0].current.focus();

    const payload = {
      email: email,
      type: "email",
    };

    resendOtpMutation(payload);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();

    // Extract only digits
    const digits = pasteData.replace(/\D/g, "").slice(0, 4).split("");

    // Fill whatever digits are available (max 4)
    const newOtp = ["", "", "", ""];
    digits.forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);

    // Focus next empty input or last
    const nextIndex = digits.length < 4 ? digits.length : 3;
    inputRefs[nextIndex].current.focus();
  };

  return (
    <>
      {contextHolder}
      <AuthLayout>
        <div className="w-full max-w-sm">
          {/* Title & Subtext */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#122751] mb-1">
              Verify Your Email Address
            </h2>
            <p className="text-sm text-[#8D94A3]">
              We sent a code to{" "}
              <span className="font-medium text-[#122751]">{email}</span>
            </p>
          </div>

          {/* OTP Form */}
          <Form onFinish={handleSubmit} className="flex flex-col items-center">
            <div className={`otp-input-group${otpError ? " shake" : ""}`}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={inputRefs[index]}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`otp-input${otpError ? " error" : ""}`}
                  disabled={isLoading}
                  onPaste={handlePaste}
                />
              ))}
            </div>

            {/* Submit Button */}
            <PrimaryButton
              htmlType="submit"
              className="w-full mt-5"
              disabled={isLoading || showLoader}
            >
              {showLoader ? <LoadingButton size="small" /> : "Verify Code"}
            </PrimaryButton>
          </Form>

          {/* Resend Link */}
          <div className="mt-6 text-sm text-[#122751] flex items-center justify-center gap-1">
            Didn't receive the code?{" "}
            <button
              onClick={handleOtpResend}
              type="button"
              className="text-[#01B763] text-sm font-medium cursor-pointer"
              disabled={isLoading}
            >
              Click to resend
            </button>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default VerifyOtp;
