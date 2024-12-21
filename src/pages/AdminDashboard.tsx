import React from "react";
import { useAuthStore } from "../store/useAuthStore";

export const AdminDashboard: React.FC = () => {
  const { loginEnabled, setLoginEnabled } = useAuthStore();

  const toggleLoginEnabled = () => {
    setLoginEnabled(!loginEnabled);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="mt-6">
          <button
            onClick={toggleLoginEnabled}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              loginEnabled
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loginEnabled ? "Disable Logins" : "Enable Logins"}
          </button>
        </div>
      </div>
    </div>
  );
};
