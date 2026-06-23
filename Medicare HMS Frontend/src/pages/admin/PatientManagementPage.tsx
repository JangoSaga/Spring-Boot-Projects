import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService, appointmentService, medicalRecordService } from '../../services/api';
import { Patient } from '../../store/slices/patientSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, X, Activity, UserPlus, Eye, Calendar, FileText, Heart } from 'lucide-react';

const patientSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  gender: z.string().min(1, 'Please select gender'),
  dateOfBirth: z.string().min(1, 'Please select date of birth'),
  bloodGroup: z.string().min(1, 'Please select blood group'),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export const PatientManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(patientSchema)
  });

  // Main Queries
  const { data: patients, isLoading, error, refetch } = useQuery({
    queryKey: ['patients'],
    queryFn: patientService.getAll
  });

  // Sub-queries for patient profile view
  const { data: patientAppointments, isLoading: apptsLoading } = useQuery({
    queryKey: ['patientAppointments', viewingPatient?.id],
    queryFn: () => appointmentService.getByPatient(viewingPatient!.id),
    enabled: !!viewingPatient,
  });

  const { data: patientRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['patientRecords', viewingPatient?.id],
    queryFn: () => medicalRecordService.getByPatient(viewingPatient!.id),
    enabled: !!viewingPatient,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Success', description: 'Patient registered successfully', variant: 'success' });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to register patient', variant: 'danger' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatientFormValues }) => patientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Success', description: 'Patient details updated successfully', variant: 'success' });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to update patient', variant: 'danger' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: patientService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({ title: 'Removed', description: 'Patient successfully removed from registry', variant: 'success' });
      setDeletingPatientId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to delete patient', variant: 'danger' });
      setDeletingPatientId(null);
    }
  });

  const openAddModal = () => {
    setEditingPatient(null);
    reset({
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      address: '',
      medicalHistory: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pat: Patient) => {
    setEditingPatient(pat);
    setValue('fullName', pat.fullName);
    setValue('email', pat.email);
    setValue('phone', pat.phone);
    setValue('gender', pat.gender);
    setValue('dateOfBirth', pat.dateOfBirth);
    setValue('bloodGroup', pat.bloodGroup);
    setValue('address', pat.address || '');
    setValue('medicalHistory', pat.medicalHistory || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleFormSubmit = (data: any) => {
    if (editingPatient) {
      updateMutation.mutate({ id: editingPatient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <PageLoader message="Loading patient directory..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const columns = [
    { header: 'Patient Name', accessor: 'fullName' as const, className: 'font-bold text-slate-800' },
    { header: 'Gender', accessor: 'gender' as const, className: 'w-20' },
    { header: 'Date of Birth', accessor: 'dateOfBirth' as const },
    { header: 'Blood Group', accessor: 'bloodGroup' as const, className: 'font-semibold text-primary' },
    { header: 'Phone Number', accessor: 'phone' as const },
    { 
      header: 'Status', 
      accessor: (row: Patient) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {row.isActive ? 'Active' : 'Archived'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patients</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage patient admissions, personal details, medical histories, and active records.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Main Patient Table */}
      <DataTable
        columns={columns}
        data={patients || []}
        searchPlaceholder="Search patients by name, email, phone..."
        searchKey="fullName"
        actions={(row: Patient) => (
          <div className="flex justify-end gap-1">
            <button
              onClick={() => setViewingPatient(row)}
              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => openEditModal(row)}
              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeletingPatientId(row.id)}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      {/* FULL PATIENT PROFILE VIEW OVERLAY */}
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
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Clinical Schedule Logs</span>
                  </h4>
                  {apptsLoading ? (
                    <p className="text-slate-400 py-4">Fetching appointments...</p>
                  ) : !patientAppointments || patientAppointments.length === 0 ? (
                    <p className="text-slate-400 italic py-4">No appointments scheduled.</p>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {patientAppointments.map((appt: any) => (
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
                    <span>Prescriptions & Diagnoses</span>
                  </h4>
                  {recordsLoading ? (
                    <p className="text-slate-400 py-4">Loading reports...</p>
                  ) : !patientRecords || patientRecords.length === 0 ? (
                    <p className="text-slate-400 italic py-4">No medical records created yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {patientRecords.map((record: any) => (
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
              Close Patient Dossier
            </button>
          </div>
        </div>
      )}

      {/* ADD/EDIT FORM OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={closeModal}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-slate-800">
                  {editingPatient ? 'Edit Patient Details' : 'Register New Patient'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="Alice Johnson"
                    {...register('fullName')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.fullName ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="alice@gmail.com"
                    {...register('email')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.email ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 555-0199"
                    {...register('phone')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Gender</label>
                  <select
                    {...register('gender')}
                    className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.gender ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.dateOfBirth ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-[10px] mt-1">{errors.dateOfBirth.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Blood Group</label>
                  <select
                    {...register('bloodGroup')}
                    className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.bloodGroup ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && <p className="text-red-500 text-[10px] mt-1">{errors.bloodGroup.message as string}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street No, City, State"
                  {...register('address')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pre-existing Medical History</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hypertension, penicillin allergy..."
                  {...register('medicalHistory')}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="flex gap-2.5 pt-2 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg font-semibold text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold shadow-md transition-colors disabled:bg-slate-300"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingPatientId !== null}
        title="Archive Patient Record"
        description="Are you sure you want to archive this patient? This will suspend their dashboard logins and mark scheduled appointments as cancelled."
        confirmText="Yes, Archive"
        onConfirm={() => deletingPatientId && deleteMutation.mutate(deletingPatientId)}
        onCancel={() => setDeletingPatientId(null)}
      />

    </div>
  );
};
export default PatientManagementPage;
