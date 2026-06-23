import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '../services/api';
import { useToast } from '../components/Toast';
import { Activity, User, Mail, Phone, Lock, HeartHandshake } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  role: z.enum(['PATIENT', 'DOCTOR']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'PATIENT',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await authService.register(
        data.fullName,
        data.email,
        data.role,
        data.phone,
        data.password
      );
      toast({
        title: 'Registration Successful',
        description: 'Your account has been onboarded. You can now login.',
        variant: 'success'
      });
      navigate('/login');
    } catch (err: any) {
      toast({
        title: 'Registration Failed',
        description: err?.message || 'Something went wrong during sign up.',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-7 w-7 text-primary" />
            <span className="font-heading font-extrabold text-slate-800 text-xl tracking-wide">MediCare HMS</span>
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-800">Create Clinical Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register as a doctor or patient below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                {...register('fullName')}
                className={`w-full px-4 py-2.5 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.fullName ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                  }`}
              />
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            </div>
            {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="john@gmail.com"
                  {...register('email')}
                  className={`w-full px-4 py-2.5 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                    }`}
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+1 555-0100"
                  {...register('phone')}
                  className={`w-full px-4 py-2.5 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                    }`}
                />
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Your Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${register('role').name && errors.role ? 'border-red-300' : ''
                }`}>
                <input type="radio" value="PATIENT" {...register('role')} className="text-primary focus:ring-primary" />
                <span>Patient</span>
              </label>
              <label className="flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all">
                <input type="radio" value="DOCTOR" {...register('role')} className="text-primary focus:ring-primary" />
                <span>Doctor</span>
              </label>
            </div>
            {errors.role && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.role.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full px-4 py-2.5 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.password ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                    }`}
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full px-4 py-2.5 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                    }`}
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-semibold tracking-wide shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <HeartHandshake className="h-4.5 w-4.5" />
                <span>Register Account</span>
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default RegisterPage;
