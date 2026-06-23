import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { appointmentService } from '../../services/api';
import { Appointment } from '../../store/slices/appointmentSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { Clock, Calendar } from 'lucide-react';

export const DoctorAppointmentsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['doctorAppointmentsPage', user?.id],
    queryFn: () => appointmentService.getByDoctor(user!.id),
    enabled: !!user?.id,
  });

  if (isLoading) return <PageLoader message="Loading schedule registry..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  // Filter
  const filtered = (appointments || []).filter((appt: Appointment) => {
    if (statusFilter !== 'ALL' && appt.status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { header: 'Patient Name', accessor: 'patientName' as const, className: 'font-bold text-slate-800' },
    { 
      header: 'Scheduled Slot', 
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
          <h1 className="text-xl font-bold text-slate-800">My Consultation Schedule</h1>
          <p className="text-xs text-slate-500 mt-0.5">Browse through pending checkups, completed diagnoses, and cancellations.</p>
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
        searchPlaceholder="Search patients by name..."
        searchKey="patientName"
      />

    </div>
  );
};
export default DoctorAppointmentsPage;
