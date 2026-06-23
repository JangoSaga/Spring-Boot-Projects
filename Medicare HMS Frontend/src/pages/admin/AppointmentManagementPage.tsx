import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, doctorService, patientService } from '../../services/api';
import { Appointment } from '../../store/slices/appointmentSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Calendar as CalendarIcon, List, Check, X as XIcon, 
  Plus, Activity, Clock, User, HeartPulse, Building2 
} from 'lucide-react';

const appointmentSchema = z.object({
  patientId: z.coerce.number().min(1, 'Please select a patient'),
  doctorId: z.coerce.number().min(1, 'Please select a doctor'),
  appointmentDate: z.string().min(1, 'Please select appointment date'),
  appointmentTime: z.string().min(1, 'Please select appointment time'),
  symptoms: z.string().min(3, 'Symptoms description must be at least 3 characters'),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export const AppointmentManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingApptId, setCancellingApptId] = useState<number | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(appointmentSchema)
  });

  // Queries
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.getAll
  });

  const { data: doctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorService.getAll
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Slot Scheduled', description: 'Appointment booked successfully', variant: 'success' });
      setIsModalOpen(false);
      reset();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to schedule slot', variant: 'danger' });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: appointmentService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Cancelled', description: 'Appointment slot cancelled successfully', variant: 'info' });
      setCancellingApptId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to cancel slot', variant: 'danger' });
      setCancellingApptId(null);
    }
  });

  const completeMutation = useMutation({
    mutationFn: appointmentService.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Completed', description: 'Consultation logged as completed', variant: 'success' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to log status', variant: 'danger' });
    }
  });

  if (isLoading) return <PageLoader message="Loading hospital appointments..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  // Filter List
  const filteredAppts = (appointments || []).filter((appt: Appointment) => {
    if (statusFilter !== 'ALL' && appt.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { header: 'Patient Name', accessor: 'patientName' as const, className: 'font-bold text-slate-800' },
    { header: 'Assigned Doctor', accessor: 'doctorName' as const, className: 'font-semibold text-slate-700' },
    { 
      header: 'Date & Time', 
      accessor: (row: Appointment) => (
        <div className="flex items-center gap-1.5 font-semibold text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.appointmentDate} at {row.appointmentTime}</span>
        </div>
      )
    },
    { header: 'Declared Symptoms', accessor: 'symptoms' as const, className: 'max-w-xs truncate text-slate-400 font-normal' },
    { 
      header: 'Status', 
      accessor: (row: Appointment) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
          row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
          'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track, cancel, complete, and schedule new patient consultations.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {/* View Toggle */}
          <div className="flex border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-slate-400 select-none">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white text-slate-700 shadow-sm' : 'hover:text-slate-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-white text-slate-700 shadow-sm' : 'hover:text-slate-700'}`}
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Primary views */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredAppts}
          searchPlaceholder="Search by patient or doctor name..."
          searchKey="patientName"
          actions={(row: Appointment) => (
            <div className="flex justify-end gap-1">
              {row.status === 'SCHEDULED' && (
                <>
                  <button
                    onClick={() => completeMutation.mutate(row.id)}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Mark Completed"
                  >
                    <Check className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setCancellingApptId(row.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Appointment"
                  >
                    <XIcon className="h-4.5 w-4.5" />
                  </button>
                </>
              )}
            </div>
          )}
        />
      ) : (
        /* Calendar / Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppts.map((appt: Appointment) => (
            <div key={appt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow relative">
              <div className="flex items-start justify-between border-b border-slate-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-slate-400" />
                  <div>
                    <h3 className="font-bold text-slate-800 leading-none">{appt.patientName}</h3>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Patient</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                  appt.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700' :
                  appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                  'bg-red-50 text-red-700'
                }`}>{appt.status}</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Consulting: <span className="font-semibold text-slate-700">{appt.doctorName}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Time: <span className="font-semibold text-slate-700">{appt.appointmentDate} at {appt.appointmentTime}</span></span>
                </div>
                <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-lg text-slate-500 italic mt-2">
                  "{appt.symptoms}"
                </div>
              </div>

              {appt.status === 'SCHEDULED' && (
                <div className="flex gap-2 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => setCancellingApptId(appt.id)}
                    className="flex-1 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => completeMutation.mutate(appt.id)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-slate-800">Schedule Consultation Slot</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Select Patient</label>
                <select
                  {...register('patientId')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                    errors.patientId ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                  }`}
                >
                  <option value="">Choose Patient</option>
                  {patients?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} (ID: #{p.id})</option>
                  ))}
                </select>
                {errors.patientId && <p className="text-red-500 text-[10px] mt-1">{errors.patientId.message as string}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Assigned Doctor</label>
                <select
                  {...register('doctorId')}
                  className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                    errors.doctorId ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                  }`}
                >
                  <option value="">Choose Doctor</option>
                  {doctors?.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.fullName} ({d.specialization})</option>
                  ))}
                </select>
                {errors.doctorId && <p className="text-red-500 text-[10px] mt-1">{errors.doctorId.message as string}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    {...register('appointmentDate')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.appointmentDate ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.appointmentDate && <p className="text-red-500 text-[10px] mt-1">{errors.appointmentDate.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Time Slot</label>
                  <input
                    type="time"
                    {...register('appointmentTime')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.appointmentTime ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.appointmentTime && <p className="text-red-500 text-[10px] mt-1">{errors.appointmentTime.message as string}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Declared Symptoms</label>
                <textarea
                  rows={2.5}
                  placeholder="Patient declared reasons for checkup..."
                  {...register('symptoms')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                    errors.symptoms ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                  }`}
                />
                {errors.symptoms && <p className="text-red-500 text-[10px] mt-1">{errors.symptoms.message as string}</p>}
              </div>

              <div className="flex gap-2.5 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold shadow-md transition-colors disabled:bg-slate-300"
                >
                  {createMutation.isPending ? 'Scheduling...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={cancellingApptId !== null}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this consultation slot? An alert notification will be sent to both patient and doctor."
        confirmText="Yes, Cancel"
        onConfirm={() => cancellingApptId && cancelMutation.mutate(cancellingApptId)}
        onCancel={() => setCancellingApptId(null)}
      />

    </div>
  );
};
export default AppointmentManagementPage;
