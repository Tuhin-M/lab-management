import React from "react";

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

export default LoadingFallback;
