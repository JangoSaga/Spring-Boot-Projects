import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { appointmentService, medicalRecordService } from '../../services/api';
import { Appointment } from '../../store/slices/appointmentSlice';
import { PageLoader, ErrorState, EmptyState } from '../../components/FeedbackStates';
import { useToast } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Activity, Calendar, Check, Play, Eye,
  X, User, ClipboardList, ShieldAlert, Heart, CalendarPlus,
  Clock
} from 'lucide-react';

const consultationSchema = z.object({
  diagnosis: z.string().min(3, 'Diagnosis must be at least 3 characters'),
  prescription: z.string().min(5, 'Prescription must specify medicine details'),
  treatmentNotes: z.string().min(5, 'Treatment notes must be filled'),
  followUpDate: z.string().optional(),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema)
  });

  // Queries
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['doctorAppointments', user?.id],
    queryFn: () => appointmentService.getByDoctor(user!.id),
    enabled: !!user?.id,
  });

  // Mutations
  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormValues & { appointmentId: number; patientId: number }) => {
      // 1. Log medical record
      await medicalRecordService.create({
        patientId: data.patientId,
        doctorId: user!.id,
        diagnosis: data.diagnosis,
        symptoms: activeConsultation!.symptoms,
        prescription: data.prescription,
        treatmentNotes: data.treatmentNotes,
        followUpDate: data.followUpDate,
      });

      // 2. Complete appointment
      return appointmentService.complete(data.appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorAppointments'] });
      toast({
        title: 'Consultation Logged',
        description: 'Medical record filed and appointment marked as completed.',
        variant: 'success'
      });
      setActiveConsultation(null);
      reset();
    },
    onError: (err: any) => {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to record consultation',
        variant: 'danger'
      });
    }
  });

  if (isLoading) return <PageLoader message="Loading clinician dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  // Filter schedules
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's appointments
  const todaysAppointments = (appointments || []).filter((a: any) =>
    a.appointmentDate === todayStr || a.status === 'SCHEDULED'
  );

  const pendingCount = todaysAppointments.filter((a: any) => a.status === 'SCHEDULED').length;
  const completedTodayCount = todaysAppointments.filter((a: any) => a.status === 'COMPLETED').length;

  const handleStartConsultation = (appt: Appointment) => {
    setActiveConsultation(appt);
  };

  const handleCloseConsultation = () => {
    setActiveConsultation(null);
    reset();
  };

  const handleFormSubmit = (data: ConsultationFormValues) => {
    if (!activeConsultation) return;
    consultationMutation.mutate({
      ...data,
      appointmentId: activeConsultation.id,
      patientId: activeConsultation.patientId,
    });
  };

  return (
    <div className="space-y-6">

      {/* Clinician Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Welcome, {user?.fullName}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Cardiology Clinical Department | Shift Status: <span className="text-emerald-600 font-semibold uppercase">Active Duty</span></p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Scheduled Queue</span>
            <span className="block text-2xl font-bold text-slate-800">{todaysAppointments.length} Today</span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Queue</span>
            <span className="block text-2xl font-bold text-amber-600">{pendingCount} Waiting</span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-500 rounded-lg">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completed Consultations</span>
            <span className="block text-2xl font-bold text-emerald-600">{completedTodayCount} Checkups</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Check className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Today's Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Patient Queue Cards List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between shrink-0">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Today's Patient Queue</h3>
            <span className="text-[10px] text-slate-400 font-semibold">{todaysAppointments.length} Consultations</span>
          </div>

          {todaysAppointments.length === 0 ? (
            <EmptyState description="You have no patient schedules scheduled for today." />
          ) : (
            <div className="space-y-3">
              {todaysAppointments.map((appt: any) => (
                <div
                  key={appt.id}
                  className={`bg-white p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${appt.status === 'SCHEDULED'
                      ? 'border-slate-200 hover:border-slate-300'
                      : 'border-slate-100 bg-slate-50/50 opacity-80'
                    }`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold border shrink-0">
                      {appt.patientName?.charAt(0) || 'P'}
                    </div>
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-slate-800 leading-tight">{appt.patientName}</h4>
                      <p className="text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                        <span>Slot: {appt.appointmentTime} | Symptoms: "{appt.symptoms}"</span>
                      </p>
                    </div>
                  </div>

                  {appt.status === 'SCHEDULED' ? (
                    <button
                      onClick={() => handleStartConsultation(appt)}
                      className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 self-end sm:self-center"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Start Checkup</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 self-end sm:self-center">
                      <Check className="h-3.5 w-3.5" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Clinic Guidelines panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-72 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Clinical Standards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Maintain precise documentation when filing diagnoses. Ensure all medications declared in prescriptions specify dosage (mg) and frequencies (e.g., once daily) for patient safety.
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-400" />
            <span>Integrated with HIPAA and WCAG specifications.</span>
          </div>
        </div>

      </div>

      {/* COMPREHENSIVE CLINICAL CHECKUP MODAL OVERLAY */}
      {activeConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={handleCloseConsultation}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4 max-h-[90vh] overflow-hidden">

            <button
              onClick={handleCloseConsultation}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 shrink-0">
              <Heart className="h-5 w-5 text-primary animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-slate-800">Clinical Consultation Entry</h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-none mt-1">Consulting: {activeConsultation.patientName}</p>
              </div>
            </div>

            {/* Scrollable Form Box */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
              <div>
                <span className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">Declared Symptoms</span>
                <p className="bg-slate-50 border p-3 rounded-lg text-slate-500 leading-relaxed italic">
                  "{activeConsultation.symptoms}"
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Primary Diagnosis</label>
                <input
                  type="text"
                  placeholder="e.g. Acute Bronchitis"
                  {...register('diagnosis')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${errors.diagnosis ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                />
                {errors.diagnosis && <p className="text-red-500 text-[10px] mt-1">{errors.diagnosis.message}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Prescriptions & Dosages</label>
                <input
                  type="text"
                  placeholder="e.g. Amoxicillin 500mg (3x daily for 7 days), Paracetamol 500mg"
                  {...register('prescription')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${errors.prescription ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                />
                {errors.prescription && <p className="text-red-500 text-[10px] mt-1">{errors.prescription.message}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Treatment & Assessment Notes</label>
                <textarea
                  rows={3}
                  placeholder="Clinical assessment notes..."
                  {...register('treatmentNotes')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${errors.treatmentNotes ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                />
                {errors.treatmentNotes && <p className="text-red-500 text-[10px] mt-1">{errors.treatmentNotes.message}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Follow-up Date (Optional)</label>
                <input
                  type="date"
                  {...register('followUpDate')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2.5 pt-2 justify-end border-t border-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseConsultation}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-600 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={consultationMutation.isPending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-md transition-colors disabled:bg-slate-300 flex items-center gap-1"
                >
                  {consultationMutation.isPending ? 'Logging...' : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>File Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default DoctorDashboardPage;
