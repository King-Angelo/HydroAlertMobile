import { useState } from 'react';
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff, UserPlus, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { authApi } from '../services/authApi';

type Language = 'en' | 'fil';
export type UserRole = 'resident' | 'official' | 'administrator';

export interface UserSession {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  barangay: string;
}

interface SignInScreenProps {
  language: Language;
  onSignIn: (user: UserSession) => void;
}

export default function SignInScreen({ language, onSignIn }: SignInScreenProps) {
  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign Up Form State
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('resident');
  const [signUpBarangay, setSignUpBarangay] = useState('Barangay 728, Zone 79');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  
  // UI State
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Commented out - uncomment if you need demo mode
  // const [demoRole, setDemoRole] = useState<UserRole>('resident');

  const content = {
    en: {
      title: 'Hydro Alert',
      subtitle: 'Sign in to access flood monitoring system',
      signUpSubtitle: 'Create an account to access flood monitoring system',
      welcome: 'Welcome to Barangay 728',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      nameLabel: 'Full Name',
      namePlaceholder: 'Enter your full name',
      barangayLabel: 'Barangay',
      barangayPlaceholder: 'Enter your barangay',
      signInButton: 'Sign In',
      signUpButton: 'Sign Up',
      signingIn: 'Signing in...',
      signingUp: 'Creating account...',
      forgotPassword: 'Forgot password?',
      switchToSignUp: "Don't have an account? Sign up",
      switchToSignIn: 'Already have an account? Sign in',
      demoMode: 'Demo Mode',
      demoDescription: 'Select a role to test the application',
      selectRole: 'Select a role',
      roles: {
        resident: 'Resident - Standard User',
        official: 'Barangay Official',
        administrator: 'System Administrator'
      },
      demoSignIn: 'Sign In as Demo User',
      errors: {
        invalidCredentials: 'Invalid email or password. Please try again.',
        emptyFields: 'Please fill in all required fields.',
        passwordMismatch: 'Passwords do not match.',
        networkError: 'Unable to connect. Please check your connection.',
        emailInUse: 'An account with this email already exists.',
        weakPassword: 'Password is too weak. Please choose a stronger password.',
        invalidEmail: 'Please enter a valid email address.'
      },
      success: {
        accountCreated: 'Account created successfully! You can now sign in.',
        resetEmailSent: 'Password reset email sent. Please check your inbox.'
      },
      roleDescriptions: {
        resident: 'Access flood alerts, evacuation routes, and emergency assistance',
        official: 'Monitor community reports, manage evacuations, and coordinate response',
        administrator: 'Full system access, user management, and configuration'
      }
    },
    fil: {
      title: 'Hydro Alert',
      subtitle: 'Mag-sign in para ma-access ang flood monitoring system',
      signUpSubtitle: 'Gumawa ng account para ma-access ang flood monitoring system',
      welcome: 'Maligayang Pagdating sa Barangay 728',
      emailLabel: 'Email',
      emailPlaceholder: 'Ilagay ang inyong email',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Ilagay ang inyong password',
      confirmPasswordLabel: 'Kumpirmahin ang Password',
      confirmPasswordPlaceholder: 'Kumpirmahin ang inyong password',
      nameLabel: 'Buong Pangalan',
      namePlaceholder: 'Ilagay ang inyong buong pangalan',
      barangayLabel: 'Barangay',
      barangayPlaceholder: 'Ilagay ang inyong barangay',
      signInButton: 'Mag-Sign In',
      signUpButton: 'Mag-Sign Up',
      signingIn: 'Nagsa-sign in...',
      signingUp: 'Ginagawa ang account...',
      forgotPassword: 'Nakalimutan ang password?',
      switchToSignUp: 'Walang account? Mag-sign up',
      switchToSignIn: 'May account na? Mag-sign in',
      demoMode: 'Demo Mode',
      demoDescription: 'Pumili ng role upang subukan ang application',
      selectRole: 'Pumili ng role',
      roles: {
        resident: 'Residente - Standard User',
        official: 'Barangay Official',
        administrator: 'System Administrator'
      },
      demoSignIn: 'Mag-Sign In bilang Demo User',
      errors: {
        invalidCredentials: 'Maling email o password. Subukan muli.',
        emptyFields: 'Pakilagay ang lahat ng kinakailangang field.',
        passwordMismatch: 'Hindi magkatugma ang mga password.',
        networkError: 'Hindi makakonekta. Pakisuri ang inyong koneksyon.',
        emailInUse: 'May account na sa email na ito.',
        weakPassword: 'Mahina ang password. Pumili ng mas malakas na password.',
        invalidEmail: 'Pakilagay ng wastong email address.'
      },
      success: {
        accountCreated: 'Matagumpay na nagawa ang account! Maaari na kayong mag-sign in.',
        resetEmailSent: 'Naipadala na ang password reset email. Pakisuri ang inyong inbox.'
      },
      roleDescriptions: {
        resident: 'Access sa flood alerts, evacuation routes, at emergency assistance',
        official: 'Monitor ng community reports, pag-manage ng evacuations, at koordinasyon',
        administrator: 'Full system access, user management, at configuration'
      }
    }
  };

  const t = content[language];

  // Mock user database - Commented out (not used in production)
  // Demo credentials still work on backend: 
  // resident@barangay728.ph / resident123
  // official@barangay728.ph / official123
  // admin@barangay728.ph / admin123
  /*
  const mockUsers = {
    resident: {
      id: 'res001',
      username: 'juan.delaCruz',
      email: 'resident@barangay728.ph',
      password: 'resident123',
      role: 'resident' as UserRole,
      name: 'Juan dela Cruz',
      barangay: 'Barangay 728, Zone 79'
    },
    official: {
      id: 'off001',
      username: 'maria.santos',
      email: 'official@barangay728.ph',
      password: 'official123',
      role: 'official' as UserRole,
      name: 'Maria Santos',
      barangay: 'Barangay 728, Zone 79'
    },
    administrator: {
      id: 'adm001',
      username: 'admin',
      email: 'admin@barangay728.ph',
      password: 'admin123',
      role: 'administrator' as UserRole,
      name: 'System Administrator',
      barangay: 'Barangay 728, Zone 79'
    }
  };
  */

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Enhanced validation
    if (!email || !password) {
      setError(t.errors.emptyFields);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Enhanced request logging
      const requestData = { 
        email: email.trim(), 
        password: '[REDACTED]',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      console.log('Attempting sign in with request data:', requestData);
      console.log('API endpoint will be called for authentication');
      
      const response = await authApi.signIn({ email: email.trim(), password });
      
      if (response.success && response.user) {
        console.log('Sign in successful, navigating to main app');
        console.log('User session data:', {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
          name: response.user.name,
          barangay: response.user.barangay
        });
        setSuccess('Sign in successful! Redirecting...');
        
        // Small delay to show success message
        setTimeout(() => {
          if (response.user) {
            onSignIn(response.user);
          }
        }, 500);
      } else {
        console.warn('Sign in response indicates failure:', response);
        setError(response.message || t.errors.invalidCredentials);
      }
    } catch (error: any) {
      // Enhanced error logging with detailed context
      const errorContext = {
        error: error,
        message: error.message,
        status: error.status,
        response: error.response,
        details: error.details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        requestData: {
          email: email.trim(),
          password: '[REDACTED]'
        }
      };
      
      console.error('Sign in error with full context:', errorContext);
      
      // Enhanced error handling with specific messages
      if (error.status === 401) {
        setError(error.message || 'Invalid email or password. Please check your credentials.');
      } else if (error.status === 404) {
        setError('User profile not found. Please contact support.');
      } else if (error.status === 400) {
        setError('Invalid email or password format. Please check your input.');
      } else if (error.status === 403) {
        setError('Access denied. Your account may be disabled.');
      } else if (error.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.message) {
        // Use the specific error message from the API
        setError(error.message);
      } else {
        setError(t.errors.networkError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!signUpEmail || !signUpPassword || !signUpName) {
      setError(t.errors.emptyFields);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError(t.errors.passwordMismatch);
      return;
    }

    if (signUpPassword.length < 6) {
      setError(t.errors.weakPassword);
      return;
    }

    if (!signUpRole) {
      setError('Please select a role.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.signUp({
        email: signUpEmail,
        password: signUpPassword,
        name: signUpName,
        role: signUpRole,
        barangay: signUpBarangay
      });
      
      if (response.success && response.user) {
        setSuccess(t.success.accountCreated);
        // Clear form
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpConfirmPassword('');
        setSignUpName('');
        // Switch to sign in mode
        setIsSignUpMode(false);
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Enhanced error handling with specific messages
      if (error.status === 400) {
        setError(error.message || 'Invalid sign up data. Please check all fields.');
      } else if (error.status === 409) {
        setError('An account with this email already exists.');
      } else if (error.status === 403) {
        setError('Access denied. Please contact support.');
      } else if (error.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.message) {
        // Use the specific error message from the API
        setError(error.message);
      } else {
        setError(t.errors.networkError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError(t.errors.invalidEmail);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authApi.forgotPassword({ email });
      
      if (response.success) {
        setSuccess(t.success.resetEmailSent);
      } else {
        setError(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error.message || t.errors.networkError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Convert Firebase User to UserSession format
      const userSession: UserSession = {
        id: result.user.uid,
        username: result.user.displayName || result.user.email || 'user',
        email: result.user.email || '',
        role: 'resident', // Default role for Google sign-ins
        name: result.user.displayName || 'User',
        barangay: 'Barangay 728, Zone 79' // Default barangay
      };
      
      onSignIn(userSession);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Commented out - uncomment if you need demo mode
  // const handleDemoSignIn = () => {
  //   const demoUser = mockUsers[demoRole];
  //   const { password: _, ...userSession } = demoUser;
  //   onSignIn(userSession);
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center text-white space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white rounded-full p-4">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.69L17 7.19V13.69C17 17.69 14.5 21.19 12 22.19C9.5 21.19 7 17.69 7 13.69V7.19L12 2.69Z" fill="#2563eb"/>
                <path d="M12 8C10.9 8 10 8.9 10 10C10 10.5 10.2 11 10.5 11.3L9.5 16H14.5L13.5 11.3C13.8 11 14 10.5 14 10C14 8.9 13.1 8 12 8Z" fill="white"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl">{t.title}</h1>
          <p className="text-blue-100">{t.welcome}</p>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sign In / Sign Up Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isSignUpMode ? t.signUpButton : t.signInButton}</CardTitle>
            <CardDescription>
              {isSignUpMode ? t.signUpSubtitle : t.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSignUpMode ? (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="signUpName">{t.nameLabel}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signUpName"
                      type="text"
                      placeholder={t.namePlaceholder}
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="pl-10"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="signUpEmail">{t.emailLabel}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signUpEmail"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="signUpRole">Role</Label>
                  <Select value={signUpRole} onValueChange={(value: string) => setSignUpRole(value as UserRole)}>
                    <SelectTrigger id="signUpRole">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">{t.roles.resident}</SelectItem>
                      <SelectItem value="official">{t.roles.official}</SelectItem>
                      <SelectItem value="administrator">{t.roles.administrator}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-1">
                    {t.roleDescriptions[signUpRole]}
                  </p>
                </div>

                {/* Barangay */}
                <div className="space-y-2">
                  <Label htmlFor="signUpBarangay">{t.barangayLabel}</Label>
                  <Input
                    id="signUpBarangay"
                    type="text"
                    placeholder={t.barangayPlaceholder}
                    value={signUpBarangay}
                    onChange={(e) => setSignUpBarangay(e.target.value)}
                    autoComplete="address-level2"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="signUpPassword">{t.passwordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signUpPassword"
                      type={showSignUpPassword ? 'text' : 'password'}
                      placeholder={t.passwordPlaceholder}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="signUpConfirmPassword">{t.confirmPasswordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signUpConfirmPassword"
                      type={showSignUpConfirmPassword ? 'text' : 'password'}
                      placeholder={t.confirmPasswordPlaceholder}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showSignUpConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t.signingUp}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {t.signUpButton}
                    </>
                  )}
                </Button>

                {/* Switch to Sign In */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t.switchToSignIn}
                  </button>
                </div>
              </form>
            ) : (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t.emailLabel}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t.passwordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t.signingIn}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t.signInButton}
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Forgot Password & Switch to Sign Up */}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUpMode(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t.switchToSignUp}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Demo Mode Card - Hidden in production */}
        {/* Uncomment below to show demo mode for testing */}
        {/* 
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">{t.demoMode}</CardTitle>
            <CardDescription className="text-blue-700">
              {t.demoDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-blue-900">{t.selectRole}</Label>
              <Select value={demoRole} onValueChange={(value: string) => setDemoRole(value as UserRole)}>
                <SelectTrigger id="role" className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resident">{t.roles.resident}</SelectItem>
                  <SelectItem value="official">{t.roles.official}</SelectItem>
                  <SelectItem value="administrator">{t.roles.administrator}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-blue-600 mt-2">
                {t.roleDescriptions[demoRole]}
              </p>
            </div>
            <Button
              onClick={handleDemoSignIn}
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-100"
            >
              {t.demoSignIn}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 text-white">
          <CardContent className="pt-6">
            <p className="text-xs mb-2">
              {language === 'en' ? 'Demo Credentials:' : 'Demo Credentials:'}
            </p>
            <div className="space-y-1 text-xs font-mono">
              <p>Resident: resident@barangay728.ph / resident123</p>
              <p>Official: official@barangay728.ph / official123</p>
              <p>Admin: admin@barangay728.ph / admin123</p>
            </div>
          </CardContent>
        </Card>
        */}
      </div>
    </div>
  );
}
