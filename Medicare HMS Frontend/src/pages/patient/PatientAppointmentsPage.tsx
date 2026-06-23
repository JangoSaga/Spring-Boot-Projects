import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { appointmentService } from '../../services/api';
import { Appointment } from '../../store/slices/appointmentSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { Clock, X } from 'lucide-react';

export const PatientAppointmentsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingApptId, setCancellingApptId] = useState<number | null>(null);

  // Queries
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['patientAppointmentsPage', user?.id],
    queryFn: () => appointmentService.getByPatient(user!.id),
    enabled: !!user?.id,
  });

  // Mutations
  const cancelMutation = useMutation({
    mutationFn: appointmentService.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientAppointmentsPage'] });
      queryClient.invalidateQueries({ queryKey: ['patientDashboardAppts'] });
      toast({ title: 'Slot Cancelled', description: 'Consultation slot successfully cancelled', variant: 'info' });
      setCancellingApptId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to cancel slot', variant: 'danger' });
      setCancellingApptId(null);
    }
  });

  if (isLoading) return <PageLoader message="Loading checkup history..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  // Filter
  const filtered = (appointments || []).filter((appt: Appointment) => {
    if (statusFilter !== 'ALL' && appt.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { header: 'Attending Doctor', accessor: 'doctorName' as const, className: 'font-bold text-slate-800' },
    { 
      header: 'Scheduled Slot', 
      accessor: (row: Appointment) => (
        <div className="flex items-center gap-1.5 font-semibold text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>{row.appointmentDate} at {row.appointmentTime}</span>
        </div>
      )
    },
    { header: 'Symptoms Declared', accessor: 'symptoms' as const, className: 'max-w-xs truncate text-slate-400 font-normal' },
    { 
      header: 'Status', 
      accessor: (row: Appointment) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700' :
          row.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
          'bg-red-50 text-red-700'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Consultation Bookings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and review your checkups history logs.</p>
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
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Search doctors..."
        searchKey="doctorName"
        actions={(row: Appointment) => (
          <div className="flex justify-end">
            {row.status === 'SCHEDULED' && (
              <button
                onClick={() => setCancellingApptId(row.id)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 border border-transparent hover:border-red-100"
                title="Cancel Booking"
              >
                <X className="h-4.5 w-4.5" />
                <span className="text-[10px] font-bold">Cancel</span>
              </button>
            )}
          </div>
        )}
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={cancellingApptId !== null}
        title="Cancel Consultation Booking"
        description="Are you sure you want to cancel this scheduled consultation? This slot will be re-opened for other hospital patients."
        confirmText="Yes, Cancel Booking"
        onConfirm={() => cancellingApptId && cancelMutation.mutate(cancellingApptId)}
        onCancel={() => setCancellingApptId(null)}
      />

    </div>
  );
};
export default PatientAppointmentsPage;
