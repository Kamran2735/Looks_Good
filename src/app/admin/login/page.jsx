'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { RiLockLine, RiMailLine } from 'react-icons/ri';
import { Poppins } from 'next/font/google';

// Same font as team section
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

// Primary theme colors from team section
const themeColors = {
  primary: '#0c4000',
  secondary: '#1a8c00', 
  accent: '#43e794',
  light: '#cdf1d8',
  dark: '#072500',
  white: '#ffffff',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetAttempts, setResetAttempts] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(null);
  const [cooldown, setCooldown] = useState(0);


  const router = useRouter();

  // For the animated equalizer
  const [equalizerHeights, setEqualizerHeights] = useState([]);


useEffect(() => {
  if (showResetModal) {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowResetModal(false);
        setResetEmail('');
        setResetError('');
        setResetSuccess('');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }
}, [showResetModal]);


  // Initialize and animate the equalizer bars
  useEffect(() => {
    // Initial heights for 5 bars
    setEqualizerHeights([15, 20, 25, 18, 22]);
    
    // Animation interval
    const animationInterval = setInterval(() => {
      setEqualizerHeights(prevHeights => 
        prevHeights.map(() => Math.floor(Math.random() * 15) + 10) // Random height between 10-25px
      );
    }, 800); // Update every 800ms
    
    return () => clearInterval(animationInterval);
  }, []);

const handleLogin = async (e) => {
  e.preventDefault();

  // If user is blocked
  if (isBlocked) {
    const timeLeft = Math.ceil((blockTime - Date.now()) / 1000);
    setError(`Too many failed attempts. Try again in ${timeLeft} seconds.`);
    return;
  }

  setError('');
  setLoading(true);

  try {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    
    // Reset login attempts on successful login
    setLoginAttempts(0);
    setIsBlocked(false);
    setBlockTime(null);
    router.push('/admin/dashboard');

  } catch (err) {
    console.error(err);

    setLoginAttempts(prev => {
      const updated = prev + 1;

      if (updated >= 5) {
        setIsBlocked(true);
        const unblockAt = Date.now() + 30000; // 30 seconds block
        setBlockTime(unblockAt);

        // Automatically unblock after timeout
        setTimeout(() => {
          setIsBlocked(false);
          setLoginAttempts(0);
          setBlockTime(null);
        }, 30000);
      }

      return updated;
    });

    if (err.code === 'auth/invalid-email') {
      setError('Please enter a valid email address.');
    } else if (err.code === 'auth/user-not-found') {
      setError('No account found with this email. Please check and try again.');
    } else if (err.code === 'auth/wrong-password') {
      setError('Incorrect password. Please try again.');
    } else if (err.code === 'auth/too-many-requests') {
      setError('Too many failed login attempts. Please try again later.');
    } else if (err.code === 'auth/network-request-failed') {
      setError('Network error. Please check your connection and try again.');
    } else {
      setError('Login failed. Please check your credentials and try again.');
    }
  } finally {
    setLoading(false);
  }
};


// Handle password reset
const handlePasswordReset = async () => {
  const now = Date.now();

  // Clear previous messages on every click
  setResetError('');
  setResetSuccess('');

  // Too many attempts
  if (resetAttempts >= 5) {
    setResetError('Too many attempts. Please try again later.');
    return;
  }

  // Cooldown in effect
  if (lastResetTime && now - lastResetTime < 30000) {
    const secondsLeft = Math.ceil((30000 - (now - lastResetTime)) / 1000);
    setResetError(`Please wait ${secondsLeft} seconds before trying again.`);
    return;
  }

  if (!resetEmail) {
    setResetError('Please enter your email address.');
    return;
  }

  try {
    await sendPasswordResetEmail(auth, resetEmail);
    setResetSuccess('If this email is registered, you’ll receive a reset link.');
    setResetAttempts(prev => prev + 1);
    setLastResetTime(now);
  } catch (err) {
    if (err.code === 'auth/invalid-email') {
      setResetError('Invalid email address.');
    } else {
      setResetSuccess('If this email is registered, you’ll receive a reset link.');
    }
  }
};


  return (
    <div 
      className={`flex min-h-screen items-center justify-center ${poppins.className}`}
      style={{ 
        background: `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.dark} 100%)`,
      }}
    >
      <div className="w-full max-w-4xl mx-4">
        <div className="flex rounded-2xl shadow-2xl overflow-hidden">
          {/* Left Panel - Brand/Info Side */}
          <div 
            className="w-1/2 p-8 hidden md:flex flex-col justify-center items-center text-center"
            style={{
              background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.primary} 100%)`,
            }}
          >
            <div className="mb-6">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-green-300/30 mb-4 mx-auto">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Studio Admin</h2>
            </div>
            
            <p className="text-green-200 mb-8">
              Secure access to your content management system
            </p>
            
            {/* Animated equalizer with fixed container height */}
            <div className="flex items-end justify-center space-x-1 mb-4 h-8">
              {equalizerHeights.map((height, i) => (
                <div 
                  key={i}
                  className="w-1 rounded-full bg-green-300/50 transition-all duration-500"
                  style={{ 
                    height: `${height}px`,
                    transform: 'scaleY(1)',
                    transformOrigin: 'bottom'
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Right Panel - Login Form */}
          <div 
            className="w-full md:w-1/2 p-8 bg-white"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                Login
              </h3>
              <p className="text-gray-500 text-sm">
                Enter your credentials to continue
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div 
                  className="p-3 rounded text-sm text-red-700 bg-red-100 border border-red-200 mb-4 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiMailLine style={{ color: themeColors.secondary }} />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full py-3 pl-10 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockLine style={{ color: themeColors.secondary }} />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full py-3 pl-10 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
<div className="flex items-center justify-between">
  {/* Remember Me */}
  <div className="flex items-center">
    <input
      id="rememberMe"
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
      className="mr-2"
    />
    <label htmlFor="rememberMe" className="text-gray-500 text-sm">
      Keep me logged in
    </label>
  </div>

  {/* Forgot Password */}
<button
  type="button"
  onClick={() => setShowResetModal(true)}
  className="text-sm hover:underline transition"
  style={{ color: themeColors.secondary }}
>
  Forgot password?
</button>


</div>


              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 shadow hover:shadow-md relative overflow-hidden"
                style={{
                  background: `linear-gradient(to right, ${themeColors.secondary}, ${themeColors.accent})`,
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </span>
                ) : 'Sign In to Dashboard'}
              </button>
            </form>

            {showResetModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30"
    onKeyDown={(e) => {
      if (e.key === 'Escape') {
        setShowResetModal(false);
        setResetEmail('');
        setResetError('');
        setResetSuccess('');
      }
    }}
    tabIndex={-1}
  >
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative">
      <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.primary }}>
        Reset Password
      </h3>
      <p className="text-sm text-gray-600 mb-4">Enter your email to receive a reset link.</p>

      <input
        type="email"
        placeholder="Your email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        className="w-full p-3 mb-3 border rounded-md border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />

      {resetError && <p className="text-sm text-red-600 mb-2">{resetError}</p>}
      {resetSuccess && <p className="text-sm text-green-600 mb-2">{resetSuccess}</p>}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setShowResetModal(false);
            setResetEmail('');
            setResetError('');
            setResetSuccess('');
          }}
          className="text-sm px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handlePasswordReset}
          className="text-sm px-4 py-2 text-white rounded"
          style={{
            background: `linear-gradient(to right, ${themeColors.secondary}, ${themeColors.accent})`,
          }}
        >
          Send Link
        </button>
      </div>
    </div>
  </div>
)}


            
            {/* Security Notice */}
            <div className="mt-8 text-center text-gray-500 text-xs">
              <p>Protected area for authorized personnel only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}