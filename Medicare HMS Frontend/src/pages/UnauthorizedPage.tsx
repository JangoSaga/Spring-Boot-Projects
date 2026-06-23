import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleReturn = () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.role === 'ADMIN') navigate('/admin/dashboard');
    else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 animate-pulse">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            You do not possess the required administrative clearance to view this clinical portal route. Attempting to bypass role structures has been logged.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={handleReturn}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Portal Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};
export default UnauthorizedPage;
