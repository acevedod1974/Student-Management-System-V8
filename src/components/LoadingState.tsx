import React from "react";

interface Props {
  size?: "small" | "medium" | "large";
  message?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  small: "h-4 w-4",
  medium: "h-8 w-8",
  large: "h-12 w-12",
};

export function LoadingState({
  size = "medium",
  message = "Loading...",
  fullScreen = false,
}: Props) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}
      />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {content}
      </div>
    );
  }

  return content;
}
