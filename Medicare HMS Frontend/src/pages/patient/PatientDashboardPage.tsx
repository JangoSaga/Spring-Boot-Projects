import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { appointmentService, medicalRecordService } from '../../services/api';
import { Appointment } from '../../store/slices/appointmentSlice';
import { MedicalRecord } from '../../services/mockData';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Heart, FileText, Activity, 
  MapPin, CheckCircle, Clock, Pill, Eye, X 
} from 'lucide-react';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);

  // Queries
  const { data: appointments, isLoading: apptsLoading, error: apptsError, refetch: refetchAppts } = useQuery({
    queryKey: ['patientDashboardAppts', user?.id],
    queryFn: () => appointmentService.getByPatient(user!.id),
    enabled: !!user?.id,
  });

  const { data: records, isLoading: recordsLoading, error: recordsError, refetch: refetchRecords } = useQuery({
    queryKey: ['patientDashboardRecords', user?.id],
    queryFn: () => medicalRecordService.getByPatient(user!.id),
    enabled: !!user?.id,
  });

  if (apptsLoading || recordsLoading) return <PageLoader message="Opening patient workspace..." />;
  if (apptsError) return <ErrorState message={apptsError.message} onRetry={refetchAppts} />;
  if (recordsError) return <ErrorState message={recordsError.message} onRetry={refetchRecords} />;

  // Find next upcoming scheduled appointment
  const upcomingAppt = (appointments || [])
    .filter((a: Appointment) => a.status === 'SCHEDULED')
    .sort((a: Appointment, b: Appointment) => new Date(`${a.appointmentDate}T${a.appointmentTime}`).getTime() - new Date(`${b.appointmentDate}T${b.appointmentTime}`).getTime())[0];

  // Compile active medications from prescriptions
  const medicationsList = (records || [])
    .slice(0, 2)
    .map((r: MedicalRecord) => r.prescription)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      
      {/* Welcome Board */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Welcome, {user?.fullName}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your health profiles, view lab tests, and book scheduled checkups.</p>
        </div>
        <button
          onClick={() => navigate('/patient/book-appointment')}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:-translate-y-[1px]"
        >
          Book New Consultation
        </button>
      </div>

      {/* 1. UPCOMING APPOINTMENT ALERT BANNER */}
      {upcomingAppt ? (
        <div className="bg-amber-50/50 border border-amber-200/80 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-3.5 items-start text-xs text-amber-900">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold uppercase tracking-wider px-2 py-0.5 rounded">Upcoming Appointment Alert</span>
              <h4 className="font-bold text-slate-800 text-sm mt-1">{upcomingAppt.doctorName}</h4>
              <p className="text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>Scheduled for {upcomingAppt.appointmentDate} at {upcomingAppt.appointmentTime} (Room 304, Unit B)</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="flex-1 md:flex-none px-3.5 py-2 border border-amber-200 hover:bg-amber-100/50 text-amber-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Manage Booking
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl flex justify-between items-center text-xs">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <p className="text-slate-500">You have no upcoming consults scheduled. Stay on top of your health.</p>
          </div>
          <Link to="/patient/book-appointment" className="font-bold text-primary hover:underline">Book checkup now</Link>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent Medical Records List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between shrink-0">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">My Diagnostic Reports</h3>
            <Link to="/patient/medical-records" className="text-xs font-semibold text-primary hover:underline">View All</Link>
          </div>

          {!records || records.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border text-center text-slate-400 text-xs italic">
              No diagnostic entries logged on your account.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec: MedicalRecord) => (
                <div key={rec.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-all flex justify-between items-center gap-4">
                  <div className="flex gap-3 text-xs leading-relaxed">
                    <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 border shrink-0">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{rec.diagnosis}</h4>
                      <p className="text-slate-400">Consultant: {rec.doctorName} | Date: {new Date(rec.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewingRecord(rec)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border"
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Active Medications */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="h-4.5 w-4.5 text-primary" />
              <span>Active Medications</span>
            </h3>

            {medicationsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active prescriptions filed.</p>
            ) : (
              <div className="space-y-3">
                {medicationsList.map((med: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed text-slate-600 font-semibold flex gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                    <span>{med}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
            Verify dosages with your consultant before scheduling refills.
          </div>
        </div>

      </div>

      {/* RECORD DETAILS OVERLAY */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setViewingRecord(null)}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4">
            
            <button 
              onClick={() => setViewingRecord(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold text-slate-800">My Consultation Report</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-lg">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Attending Clinician</span>
                  <span className="font-semibold text-slate-700">{viewingRecord.doctorName}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Consultation Date</span>
                  <span className="font-semibold text-slate-700">{new Date(viewingRecord.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Follow-up Date</span>
                  <span className="font-semibold text-primary">{viewingRecord.followUpDate ? new Date(viewingRecord.followUpDate).toLocaleDateString() : 'None scheduled'}</span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Declared Symptoms</span>
                <p className="text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                  "{viewingRecord.symptoms}"
                </p>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Diagnosis</span>
                <p className="text-slate-700 font-bold bg-blue-50/20 p-3 rounded-lg border border-blue-100/50 leading-relaxed">
                  {viewingRecord.diagnosis}
                </p>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Prescribed Medication</span>
                <p className="text-emerald-800 font-semibold bg-emerald-50/40 p-3 rounded-lg border border-emerald-100 leading-relaxed">
                  {viewingRecord.prescription}
                </p>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Assessment & Advice</span>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line p-3 border border-slate-100 rounded-lg">
                  {viewingRecord.treatmentNotes}
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewingRecord(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
            >
              Close Record Details
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
export default PatientDashboardPage;
