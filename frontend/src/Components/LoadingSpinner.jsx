import React from "react";

const LoadingHourglass = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_rgba(64,0,128,1)_0%,_rgba(18,18,63,1)_100%)]">
      <div className="w-24 h-24 flex  animate-spin border-2 border-b-white rounded-full ">
        
      </div>
    </div>
  );
};
export default LoadingHourglass;
