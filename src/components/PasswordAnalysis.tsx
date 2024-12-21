import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const PasswordAnalysis: React.FC = () => {
  const analyzePasswords = useAuthStore((state) => state.analyzePasswords);

  const handleAnalyzePasswords = () => {
    analyzePasswords();
  };

  return (
    <div className="p-4">
      <button
        onClick={handleAnalyzePasswords}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Analyze Passwords
      </button>
    </div>
  );
};

export default PasswordAnalysis;
