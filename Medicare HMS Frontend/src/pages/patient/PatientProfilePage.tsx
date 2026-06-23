import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../services/api';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { User, Mail, Phone, Heart, Activity } from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['patientProfileData', user?.id],
    queryFn: () => patientService.getById(user!.id),
    enabled: !!user?.id,
  });

  if (isLoading) return <PageLoader message="Loading personal dossier..." />;
  if (error || !profile) return <ErrorState message={error?.message || 'Failed to load patient dossier'} />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
        <div className="h-16 w-16 bg-slate-100 flex items-center justify-center rounded-full text-primary font-bold text-xl border">
          {profile.fullName.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{profile.fullName}</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Heart className="h-4 w-4 text-primary" />
            <span>Blood Group: <span className="text-primary font-bold">{profile.bloodGroup}</span></span>
          </p>
        </div>
      </div>

      {/* Profile Info Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Patient Gender</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <User className="h-4 w-4 text-slate-400" />
              <span>{profile.gender}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Date of Birth</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <User className="h-4 w-4 text-slate-400" />
              <span>{profile.dateOfBirth}</span>
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Registered Email Address</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Contact Phone Number</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{profile.phone}</span>
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Residential Address</span>
            <div className="flex items-center gap-2 text-slate-700 font-semibold p-2.5 bg-slate-50 border rounded-lg">
              <span>{profile.address || 'Not declared'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Declared History Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
        <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1">
          <Activity className="h-4.5 w-4.5 text-slate-400" />
          <span>Patient Medical History</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 border rounded-lg">
          {profile.medicalHistory || 'No pre-existing conditions reported.'}
        </p>
      </div>

    </div>
  );
};
export default PatientProfilePage;
