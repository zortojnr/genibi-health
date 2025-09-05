import { toast } from 'react-hot-toast';

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any, context?: string): AppError {
    console.error(`Error in ${context || 'application'}:`, error);

    let appError: AppError = {
      message: 'An unexpected error occurred',
    };

    // Handle different error types
    if (error.response) {
      // HTTP error response
      const { status, data } = error.response;
      appError = {
        message: data?.message || this.getStatusMessage(status),
        code: data?.code,
        status,
        details: data,
      };
    } else if (error.request) {
      // Network error
      appError = {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      };
    } else if (error.code) {
      // Firebase or other service errors
      appError = {
        message: this.getFirebaseErrorMessage(error.code),
        code: error.code,
      };
    } else if (error.message) {
      // Generic error with message
      appError = {
        message: error.message,
      };
    }

    // Show toast notification for user-facing errors
    if (context !== 'silent') {
      toast.error(appError.message);
    }

    return appError;
  }

  private static getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication required. Please sign in.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  private static getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'Authentication error. Please try again.';
    }
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handle(error, context);
      return null;
    }
  }

  static createRetryHandler(
    maxRetries: number = 3,
    delay: number = 1000
  ) {
    return async <T>(operation: () => Promise<T>): Promise<T> => {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          
          if (attempt === maxRetries) {
            throw error;
          }
          
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, delay * Math.pow(2, attempt - 1))
          );
        }
      }
      
      throw lastError;
    };
  }
}

export default ErrorHandler;
