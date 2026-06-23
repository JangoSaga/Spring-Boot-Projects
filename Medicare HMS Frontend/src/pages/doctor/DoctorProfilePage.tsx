import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../../services/api';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { User, Mail, Phone, Landmark, Activity, Sparkles, Award } from 'lucide-react';

export const DoctorProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['doctorProfileData', user?.id],
    queryFn: () => doctorService.getById(user!.id),
    enabled: !!user?.id,
  });

  if (isLoading) return <PageLoader message="Loading clinician profile..." />;
  if (error || !profile) return <ErrorState message={error?.message || 'Failed to fetch doctor profile'} />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
        <div className="h-16 w-16 bg-slate-100 flex items-center justify-center rounded-full text-primary font-bold text-xl border overflow-hidden">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover" />
          ) : (
            profile.fullName.charAt(0)
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{profile.fullName}</h1>
          <p className="text-xs text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
            <Award className="h-4 w-4 text-primary" />
            <span>{profile.specialization} | Department of {profile.departmentName || 'General'}</span>
          </p>
        </div>
      </div>

      {/* Account credentials */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Clinical Qualifications & Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Qualifications</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <span>{profile.qualification}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Consultation Fee</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Landmark className="h-4 w-4 text-slate-400" />
              <span>${profile.consultationFee} USD</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Experience</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Activity className="h-4 w-4 text-slate-400" />
              <span>{profile.experience} Years Active Practice</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Clinical Status</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Available / On Duty</span>
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email Address</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Phone Contact</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{profile.phone || 'Not declared'}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default DoctorProfilePage;
