import React from "react";
import { PuffLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <PuffLoader color="#3b82f6" size={60} />
      <p className="mt-4 text-lg text-gray-700 font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
