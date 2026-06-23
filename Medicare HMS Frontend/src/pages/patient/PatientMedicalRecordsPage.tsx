import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { medicalRecordService } from '../../services/api';
import { MedicalRecord } from '../../services/mockData';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { Eye, FileText, X } from 'lucide-react';

export const PatientMedicalRecordsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [viewingRecord, setViewingRecord] = useState<MedicalRecord | null>(null);

  // Queries
  const { data: records, isLoading, error, refetch } = useQuery({
    queryKey: ['patientMedicalRecordsPage', user?.id],
    queryFn: () => medicalRecordService.getByPatient(user!.id),
    enabled: !!user?.id,
  });

  if (isLoading) return <PageLoader message="Loading diagnostic history..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const columns = [
    { header: 'Attending Doctor', accessor: 'doctorName' as const, className: 'font-bold text-slate-800' },
    { header: 'Diagnosis', accessor: 'diagnosis' as const, className: 'font-semibold text-slate-700' },
    { header: 'Active Prescriptions', accessor: 'prescription' as const, className: 'max-w-xs truncate text-slate-400 font-normal' },
    { 
      header: 'Filing Date', 
      accessor: (row: MedicalRecord) => (
        <span className="text-slate-500 font-semibold">{new Date(row.createdAt).toLocaleDateString()}</span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Medical Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">Dossier of clinical diagnostic reports, prescriptions, and assessment logs filed on your file.</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={records || []}
        searchPlaceholder="Search records by diagnosis..."
        searchKey="diagnosis"
        actions={(row: MedicalRecord) => (
          <button
            onClick={() => setViewingRecord(row)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border"
            title="View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
        )}
      />

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
              <h3 className="text-base font-bold text-slate-800">Clinical Consultation Details</h3>
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
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Advice & Treatment Notes</span>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line p-3 border border-slate-100 rounded-lg">
                  {viewingRecord.treatmentNotes}
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewingRecord(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
            >
              Close Details View
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
export default PatientMedicalRecordsPage;
