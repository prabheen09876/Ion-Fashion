// Error handling utility

/**
 * Formats API error messages for display
 */
export const formatApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status, data } = error.response;
    
    if (status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (status === 401) {
      return 'You are not authorized to access this resource.';
    }
    
    if (status === 403) {
      return 'Access forbidden.';
    }
    
    if (status === 500) {
      return 'Server error. Please try again later.';
    }
    
    // If the server sent a specific error message
    if (data && data.message) {
      return data.message;
    }
    
    return `Error ${status}: ${data}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your internet connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Handles API errors with a consistent approach
 */
export const handleApiError = (error: any, setError: (msg: string) => void) => {
  const errorMessage = formatApiError(error);
  setError(errorMessage);
  console.error('API Error:', error);
};