import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/api';
import { useToast } from '../components/Toast';
import { Activity, Key, Mail, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(loginStart());
    try {
      const user = await authService.login(data.email, data.password);
      dispatch(loginSuccess(user));
      
      toast({
        title: 'Authentication Successful',
        description: `Welcome back, ${user.fullName}!`,
        variant: 'success'
      });

      // Role Based Redirects
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'PATIENT') {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Login failed. Please check credentials.';
      dispatch(loginFailure(errMsg));
      toast({
        title: 'Authentication Failed',
        description: errMsg,
        variant: 'danger'
      });
    }
  };

  const handleAutofill = (role: 'admin' | 'doctor' | 'patient') => {
    if (role === 'admin') {
      setValue('email', 'admin@medicare.com');
      setValue('password', 'admin123');
    } else if (role === 'doctor') {
      setValue('email', 'sarah.jenkins@medicare.com');
      setValue('password', 'doctor123');
    } else if (role === 'patient') {
      setValue('email', 'alex@patient.com');
      setValue('password', 'patient123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Brand & Overview (Visual Display) */}
        <div className="md:w-1/2 bg-slate-900 text-slate-300 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/10 -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="flex items-center gap-2.5 relative z-10">
            <Activity className="h-8 w-8 text-primary" />
            <span className="font-heading font-extrabold text-white text-2xl tracking-wide">MediCare HMS</span>
          </div>

          <div className="my-12 relative z-10">
            <h1 className="font-heading font-bold text-3xl text-white mb-4 leading-tight">
              Enterprise-Grade Hospital Management Software
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              A comprehensive clinical portal designed to streamline patient care, manage medical queues, schedule appointments, and control administrative operations.
            </p>
            <div className="flex flex-col gap-3 text-xs border border-slate-800 p-4 rounded-xl bg-slate-950/40">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Click to Autofill Mock Credentials</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAutofill('admin')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex-1"
                >
                  Admin Portal
                </button>
                <button 
                  onClick={() => handleAutofill('doctor')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex-1"
                >
                  Dr. Jenkins
                </button>
                <button 
                  onClick={() => handleAutofill('patient')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex-1"
                >
                  Alex (Patient)
                </button>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 relative z-10">
            &copy; {new Date().getFullYear()} MediCare HMS. All Rights Reserved.
          </div>
        </div>

        {/* Right Side: Credentials Login Form */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1.5">Sign in to access your clinical dashboard</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-medium">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@hospital.com"
                  {...register('email')}
                  className={`w-full px-4 py-3 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                  }`}
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full px-4 py-3 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                  }`}
                />
                <Key className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold tracking-wide shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-[1px] disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">Register here</Link>
          </p>
        </div>

      </div>
    </div>
  );
};
export default LoginPage;
