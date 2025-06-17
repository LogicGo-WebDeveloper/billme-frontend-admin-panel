import React from "react";
import authModuleImage from "../assets/images/auth-image.webp"; // Invoice preview image
import authIcon from "../assets/images/auth-icon.webp"; // Main logo
import authIconLeft from "../assets/images/auth-icon-left.webp"; // Top left icon

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Left Side - Image + Text */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-6 xl:p-10 bg-[#FCF5EB] overflow-hidden">
        {/* Center Text and Image */}
        <div className="flex-1 flex flex-col justify-center items-start space-y-6 overflow-hidden">
          {/* Top Icon */}
          <img src={authIconLeft} alt="Top Icon" className="w-24 md:w-32 h-auto mb-2" />

          {/* Heading */}
          <div className="max-w-[90%] mt-4">
            <h2 className="text-xl md:text-xl lg:text-2xl font-semibold text-[#7D83A4]">
              Welcome back, Admin!
            </h2>
            <p className="mt-2 text-base md:text-lg lg:text-xl xl:text-xl font-bold text-[#01B763] leading-snug">
              Manage your business efficiently and keep everything in sync.
            </p>
          </div>

          {/* Image */}
          <div className="mt-6 w-full flex justify-center overflow-hidden">
            <img
              src={authModuleImage}
              alt="invoice preview"
              className="w-full h-auto max-h-[58vh] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 sm:p-10 h-screen">
        <div className="w-full max-w-lg">
          <div className="flex items-center mb-7">
            <img
              src={authIcon}
              alt="Main Logo"
              className="w-26 h-6 sm:w-[110px] sm:h-[26px] relative top-1"
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
