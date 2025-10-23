import { useState } from 'react';
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoRole, setDemoRole] = useState<UserRole>('resident');

  const content = {
    en: {
      title: 'Hydro Alert',
      subtitle: 'Sign in to access flood monitoring system',
      welcome: 'Welcome to Barangay 728',
      emailLabel: 'Email or Username',
      emailPlaceholder: 'Enter your email or username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      signInButton: 'Sign In',
      signingIn: 'Signing in...',
      forgotPassword: 'Forgot password?',
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
        emptyFields: 'Please enter both email and password.',
        networkError: 'Unable to connect. Please check your connection.'
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
      welcome: 'Maligayang Pagdating sa Barangay 728',
      emailLabel: 'Email o Username',
      emailPlaceholder: 'Ilagay ang inyong email o username',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Ilagay ang inyong password',
      signInButton: 'Mag-Sign In',
      signingIn: 'Nagsa-sign in...',
      forgotPassword: 'Nakalimutan ang password?',
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
        emptyFields: 'Pakilagay ang email at password.',
        networkError: 'Hindi makakonekta. Pakisuri ang inyong koneksyon.'
      },
      roleDescriptions: {
        resident: 'Access sa flood alerts, evacuation routes, at emergency assistance',
        official: 'Monitor ng community reports, pag-manage ng evacuations, at koordinasyon',
        administrator: 'Full system access, user management, at configuration'
      }
    }
  };

  const t = content[language];

  // Mock user database
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t.errors.emptyFields);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check credentials against mock database
      const user = Object.values(mockUsers).find(
        (u) => (u.email === email || u.username === email) && u.password === password
      );

      if (user) {
        const { password: _, ...userSession } = user;
        onSignIn(userSession);
      } else {
        setError(t.errors.invalidCredentials);
      }

      setIsLoading(false);
    }, 1000);
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

  const handleDemoSignIn = () => {
    const demoUser = mockUsers[demoRole];
    const { password: _, ...userSession } = demoUser;
    onSignIn(userSession);
  };

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

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t.signInButton}</CardTitle>
            <CardDescription>{t.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email/Username */}
              <div className="space-y-2">
                <Label htmlFor="email">{t.emailLabel}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
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

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Mode Card */}
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
              <Select value={demoRole} onValueChange={(value) => setDemoRole(value as UserRole)}>
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

        {/* Demo Credentials Info */}
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
      </div>
    </div>
  );
}
