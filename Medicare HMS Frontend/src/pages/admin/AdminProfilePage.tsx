import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { User, Mail, Phone, Calendar, ShieldCheck } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
        <div className="h-16 w-16 bg-slate-100 flex items-center justify-center rounded-full text-primary font-bold text-xl border">
          {user?.fullName.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{user?.fullName}</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Administrator Security Profile</span>
          </p>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Profile Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">User ID</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <User className="h-4 w-4 text-slate-400" />
              <span>#{user?.id}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email Address</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Contact Phone</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{user?.phone || 'Not configured'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Security Clearances</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              <span>ROLE_ADMINISTRATOR</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default AdminProfilePage;
