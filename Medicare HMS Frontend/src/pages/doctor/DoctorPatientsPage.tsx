import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { appointmentService, patientService, medicalRecordService } from '../../services/api';
import { Patient } from '../../store/slices/patientSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { Eye, User, FileText, Heart, X } from 'lucide-react';
import { MedicalRecord } from '../../services/mockData';

export const DoctorPatientsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  // Queries
  const { data: appointments, isLoading: apptsLoading } = useQuery({
    queryKey: ['doctorApptsForPatientsList', user?.id],
    queryFn: () => appointmentService.getByDoctor(user!.id),
    enabled: !!user?.id,
  });

  const { data: allPatients, isLoading: patientsLoading } = useQuery({
    queryKey: ['allPatientsForDoctorView'],
    queryFn: patientService.getAll,
  });

  // Sub-queries for profile details
  const { data: patientRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['doctorViewPatientRecords', viewingPatient?.id],
    queryFn: () => medicalRecordService.getByPatient(viewingPatient!.id),
    enabled: !!viewingPatient,
  });

  const { data: patientAppts, isLoading: apptsHistoryLoading } = useQuery({
    queryKey: ['doctorViewPatientAppts', viewingPatient?.id],
    queryFn: () => appointmentService.getByPatient(viewingPatient!.id),
    enabled: !!viewingPatient,
  });

  // Extract unique patients treated by this doctor
  const doctorPatientIds = Array.from(new Set(
    (appointments || []).map((a: any) => a.patientId)
  ));

  const doctorPatients = (allPatients || []).filter((p: Patient) => 
    doctorPatientIds.includes(p.id)
  );

  if (apptsLoading || patientsLoading) return <PageLoader message="Loading diagnostic queue files..." />;

  const columns = [
    { header: 'Patient Name', accessor: 'fullName' as const, className: 'font-bold text-slate-800' },
    { header: 'Gender', accessor: 'gender' as const },
    { header: 'Blood Group', accessor: 'bloodGroup' as const, className: 'font-semibold text-primary' },
    { header: 'Phone Number', accessor: 'phone' as const },
    { header: 'Email Address', accessor: 'email' as const }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800">My Patients</h1>
          <p className="text-xs text-slate-500 mt-0.5">Directory of patients scheduled under your department consultations.</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={doctorPatients}
        searchPlaceholder="Search patients by name..."
        searchKey="fullName"
        actions={(row: Patient) => (
          <button
            onClick={() => setViewingPatient(row)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs font-semibold">View Case File</span>
          </button>
        )}
      />

      {/* CASE FILE DETAILS OVERLAY */}
      {viewingPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setViewingPatient(null)}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] p-6 relative z-10 animate-fade-in flex flex-col gap-5 overflow-hidden">
            
            <button 
              onClick={() => setViewingPatient(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Brief Top */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 shrink-0">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-lg border">
                {viewingPatient.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{viewingPatient.fullName}</h3>
                <p className="text-xs text-slate-400 font-medium">Patient ID: #{viewingPatient.id} | Blood Group: <span className="text-primary font-semibold">{viewingPatient.bloodGroup}</span></p>
              </div>
            </div>

            {/* Scrollable Profile Content */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pr-1">
              
              {/* Left Column: Personal info & medical history */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg space-y-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                    <Heart className="h-4 w-4 text-primary" />
                    <span>Personal Info</span>
                  </h4>
                  <div className="space-y-2 leading-relaxed text-slate-600">
                    <div><span className="font-semibold text-slate-400 block text-[9px] uppercase">Gender</span>{viewingPatient.gender}</div>
                    <div><span className="font-semibold text-slate-400 block text-[9px] uppercase">Date of Birth</span>{viewingPatient.dateOfBirth}</div>
                    <div><span className="font-semibold text-slate-400 block text-[9px] uppercase">Phone Number</span>{viewingPatient.phone}</div>
                    <div><span className="font-semibold text-slate-400 block text-[9px] uppercase">Email</span>{viewingPatient.email}</div>
                    <div><span className="font-semibold text-slate-400 block text-[9px] uppercase">Residential Address</span>{viewingPatient.address || 'Not specified'}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg space-y-2">
                  <h4 className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 uppercase tracking-wide">Declared Medical History</h4>
                  <p className="text-slate-600 leading-relaxed italic">
                    {viewingPatient.medicalHistory || 'No pre-existing conditions reported.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Appointments and Medical records logs */}
              <div className="md:col-span-2 space-y-4">
                {/* 1. Appointments list */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                    <User className="h-4 w-4 text-primary" />
                    <span>Consultation History</span>
                  </h4>
                  {apptsHistoryLoading ? (
                    <p className="text-slate-400 py-4">Fetching appointments...</p>
                  ) : !patientAppts || patientAppts.length === 0 ? (
                    <p className="text-slate-400 italic py-4">No appointments scheduled.</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {patientAppts.map((appt: any) => (
                        <div key={appt.id} className="flex justify-between items-center p-2.5 bg-slate-50 border rounded-lg">
                          <div>
                            <p className="font-semibold text-slate-700">{appt.doctorName}</p>
                            <span className="text-[10px] text-slate-400">{appt.appointmentDate} at {appt.appointmentTime}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                            appt.status === 'SCHEDULED' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            appt.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'bg-red-50 text-red-700 border border-red-100'
                          }`}>{appt.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Medical records prescriptions */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Active Diagnostics Reports</span>
                  </h4>
                  {recordsLoading ? (
                    <p className="text-slate-400 py-4">Loading reports...</p>
                  ) : !patientRecords || patientRecords.length === 0 ? (
                    <p className="text-slate-400 italic py-4">No medical records filed yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {patientRecords.map((record: MedicalRecord) => (
                        <div key={record.id} className="p-3 bg-slate-50 border rounded-lg space-y-1.5">
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-700">{record.diagnosis}</span>
                            <span className="text-[10px] text-slate-400">{new Date(record.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-500 italic"><span className="font-semibold text-slate-600 block text-[9px] uppercase">Prescription</span>{record.prescription}</p>
                          <p className="text-slate-500 leading-relaxed"><span className="font-semibold text-slate-600 block text-[9px] uppercase">Notes</span>{record.treatmentNotes}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
            
            <button
              onClick={() => setViewingPatient(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0"
            >
              Close Dossier File
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default DoctorPatientsPage;
