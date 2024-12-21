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
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Analyze Passwords
      </button>
      {analysisResults && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Analysis Results</h3>
          <div>
            <h4 className="text-md font-medium">Missing Passwords:</h4>
            <ul className="list-disc list-inside">
              {analysisResults.missingPasswords.length > 0 ? (
                analysisResults.missingPasswords.map((password, index) => (
                  <li key={index}>{password}</li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
          <div className="mt-2">
            <h4 className="text-md font-medium">Repeated Passwords:</h4>
            <ul className="list-disc list-inside">
              {analysisResults.repeatedPasswords.length > 0 ? (
                analysisResults.repeatedPasswords.map((password, index) => (
                  <li key={index}>{password}</li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordAnalysis;
