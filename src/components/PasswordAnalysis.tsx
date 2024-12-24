import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const PasswordAnalysis: React.FC = () => {
  const analyzePasswords = useAuthStore((state) => state.analyzePasswords);
  const [analysisResults, setAnalysisResults] = useState<{
    missingPasswords: string[];
    repeatedPasswords: string[];
  } | null>(null);

  const handleAnalyzePasswords = () => {
    const results = analyzePasswords();
    setAnalysisResults(results);
  };

  return (
    <div className="p-4">
      <button
        onClick={handleAnalyzePasswords}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Analyze Passwords
      </button>
      {analysisResults && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Analysis Results</h3>
          <div>
            <h4 className="font-semibold">Missing Passwords:</h4>
            <ul>
              {analysisResults.missingPasswords.length > 0 ? (
                analysisResults.missingPasswords.map((email) => (
                  <li key={email}>{email}</li>
                ))
              ) : (
                <li>No missing passwords</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Repeated Passwords:</h4>
            <ul>
              {analysisResults.repeatedPasswords.length > 0 ? (
                analysisResults.repeatedPasswords.map((password, index) => (
                  <li key={index}>{password}</li>
                ))
              ) : (
                <li>No repeated passwords</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordAnalysis;
