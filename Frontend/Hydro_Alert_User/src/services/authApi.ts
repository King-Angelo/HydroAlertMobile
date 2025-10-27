// Authentication API Service
// Handles all authentication-related API calls to the backend

import { UserSession } from '../components/SignInScreen';

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  user?: T;
  token?: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  role: 'resident' | 'official' | 'administrator';
  barangay: string;
}

interface ForgotPasswordRequest {
  email: string;
}

// API Service Class
class AuthApiService {
  private readonly baseUrls = {
    signIn: 'https://signin-m5n3225u3a-uc.a.run.app',
    signUp: 'https://signup-m5n3225u3a-uc.a.run.app',
    forgotPassword: 'https://forgotpassword-m5n3225u3a-uc.a.run.app',
    getUserProfile: 'https://getuserprofile-m5n3225u3a-uc.a.run.app'
  };

  constructor() {
    console.log('AuthApiService initialized with endpoints:', this.baseUrls);
  }

  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInRequest): Promise<ApiResponse<UserSession>> {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const requestUrl = this.baseUrls.signIn;
      console.log('Sign in request URL:', requestUrl);

      const requestPayload = {
        email: credentials.email.trim(),
        password: credentials.password,
      };

      console.log('Sign in request payload:', {
        email: requestPayload.email,
        password: '[REDACTED]',
        timestamp: new Date().toISOString()
      });

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const requestOptions = {
        method: 'POST',
        headers,
        body: JSON.stringify(requestPayload),
      };

      console.log('🔵 Making sign in request with POST method');
      console.log('URL:', requestUrl);

      const response = await fetch(requestUrl, requestOptions);

      console.log('📊 Response status:', response.status);

      if (!response) {
        throw new Error('Network error: No response from server');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          responseData: data,
        };

        console.error('Sign in API error details:', errorDetails);

        let errorMessage: string;
        if (response.status === 405) {
          errorMessage = 'Method not allowed. Please contact support.';
        } else if (response.status === 404) {
          errorMessage = 'Sign in service unavailable. Please contact support.';
        } else if (response.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else {
          errorMessage = data?.message || data?.error || `Sign in failed (${response.status})`;
        }

        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = data;
        (error as any).details = errorDetails;
        throw error;
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (data.success && data.user) {
        const userSession: UserSession = {
          id: data.user.uid,
          username: data.user.email,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
          barangay: data.user.barangay,
        };

        if (data.token) {
          localStorage.setItem('hydroalert_auth_token', data.token);
          localStorage.setItem('hydroalert_token_timestamp', Date.now().toString());
          console.log('Authentication token stored successfully');
        }

        console.log('Sign in successful for user:', userSession.email);
        return {
          success: true,
          message: data.message || 'Sign in successful',
          user: userSession,
          token: data.token,
        };
      }

      throw new Error(data.message || 'Invalid response format: Missing user data');
    } catch (error) {
      console.error('Sign in API error:', error);
      throw error;
    }
  }

  /**
   * Sign up new user
   */
  async signUp(userData: SignUpRequest): Promise<ApiResponse<UserSession>> {
    try {
      if (!userData.email || !userData.password || !userData.name || !userData.role) {
        throw new Error('All required fields must be provided');
      }

      const requestUrl = this.baseUrls.signUp;
      console.log('Sign up request URL:', requestUrl);

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email.trim(),
          password: userData.password,
          name: userData.name.trim(),
          role: userData.role,
          barangay: userData.barangay?.trim() || 'Barangay 728, Zone 79',
        }),
      };

      console.log('🔵 Making sign up request with POST method');
      console.log('📤 Request payload:', {
        email: userData.email.trim(),
        password: '[REDACTED]',
        name: userData.name.trim(),
        role: userData.role,
        barangay: userData.barangay?.trim() || 'Barangay 728, Zone 79',
      });

      const response = await fetch(requestUrl, requestOptions);
      console.log('📊 Sign up response status:', response.status);
      console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response) {
        throw new Error('Network error: No response from server');
      }

      let data;
      try {
        data = await response.json();
        console.log('📥 Response data:', data);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        console.error('❌ Sign up failed with status:', response.status);
        console.error('❌ Error response data:', JSON.stringify(data, null, 2));
        console.error('❌ Error message from backend:', data?.message);
        console.error('❌ Error field from backend:', data?.error);
        console.error('❌ Success field:', data?.success);
        const errorMessage = data?.message || data?.error || `Sign up failed (${response.status})`;
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = data;
        throw error;
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from server');
      }

      if (data.success && data.user) {
        const userSession: UserSession = {
          id: data.user.uid,
          username: data.user.email,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
          barangay: data.user.barangay,
        };

        if (data.token) {
          localStorage.setItem('hydroalert_auth_token', data.token);
          console.log('Authentication token stored successfully');
        }

        console.log('Sign up successful for user:', userSession.email);
        return {
          success: true,
          message: data.message || 'Account created successfully',
          user: userSession,
          token: data.token,
        };
      }

      throw new Error(data.message || 'Invalid response format: Missing user data');
    } catch (error) {
      console.error('Sign up API error:', error);
      throw error;
    }
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const requestUrl = this.baseUrls.forgotPassword;
      console.log('Forgot password request URL:', requestUrl);

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      return data;
    } catch (error) {
      console.error('Forgot password API error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<ApiResponse<UserSession>> {
    try {
      const token = localStorage.getItem('hydroalert_auth_token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const requestUrl = this.baseUrls.getUserProfile;
      console.log('Get user profile request URL:', requestUrl);

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      if (data.success && data.user) {
        const userSession: UserSession = {
          id: data.user.uid,
          username: data.user.email,
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
          barangay: data.user.barangay,
        };

        return {
          success: true,
          message: data.message,
          user: userSession,
        };
      }

      throw new Error(data.message || 'Invalid response format');
    } catch (error) {
      console.error('Get user profile API error:', error);
      throw error;
    }
  }

  /**
   * Clear stored authentication data
   */
  signOut(): void {
    localStorage.removeItem('hydroalert_auth_token');
    localStorage.removeItem('hydroalert_token_timestamp');
    console.log('Authentication data cleared');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('hydroalert_auth_token');
    return !!token;
  }

  /**
   * Get stored authentication token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('hydroalert_auth_token');
  }
}

// Export singleton instance
export const authApi = new AuthApiService();
export default authApi;