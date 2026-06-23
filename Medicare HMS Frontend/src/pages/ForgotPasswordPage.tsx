import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../components/Toast';
import { Activity, Mail, ArrowLeft, Send } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema)
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setLoading(true);
    // Simulate API dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: 'Recovery Email Sent',
        description: `Instructions have been dispatched to ${data.email}.`,
        variant: 'success'
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-7 w-7 text-primary" />
            <span className="font-heading font-extrabold text-slate-800 text-xl tracking-wide">MediCare HMS</span>
          </div>
          <h2 className="font-heading text-lg font-bold text-slate-800">Password Recovery</h2>
          <p className="text-xs text-slate-400 mt-1 text-center">Enter your email to receive recovery instructions</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@hospital.com"
                  {...register('email')}
                  className={`w-full px-4 py-3 pl-10 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                  }`}
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
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
                  <Send className="h-4 w-4" />
                  <span>Send Reset Instructions</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Check your inbox</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We have dispatched a temporary password reset token to your email address. Please click the link inside to set a new password.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-primary hover:underline block mx-auto mt-2"
            >
              Resend email
            </button>
          </div>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6">
          <Link to="/login" className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
export default ForgotPasswordPage;
