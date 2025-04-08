import { useCallback } from "react";
import toast from "react-hot-toast";

export function useApiError() {
  const handleError = useCallback((error: unknown) => {
    let message = "An unexpected error occurred";

    if (error instanceof Error) {
      message = error.message;
    }

    // Log error for debugging
    console.error("API Error:", error);

    // Show error toast to user
    toast.error(message, {
      duration: 5000,
      position: "top-right",
    });

    return message;
  }, []);

  return { handleError };
}
