import React from "react";

const CommonLoader = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
        <span className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></span>
      </div>
    </div>
  );
};

export default CommonLoader;
