import React from "react";

const CommonLoader = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#F5F5F5] rounded-md">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#01B763] border-solid" />
      <p className="mt-3 text-gray-600 font-medium text-sm">Loading...</p>
    </div>
  );
};

export default CommonLoader;
