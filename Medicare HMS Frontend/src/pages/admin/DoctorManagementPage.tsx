import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService, departmentService } from '../../services/api';
import { Doctor } from '../../store/slices/doctorSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, X, Activity, UserPlus, Eye, Landmark } from 'lucide-react';

const doctorSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  departmentId: z.coerce.number().min(1, 'Please select a department'),
  specialization: z.string().min(3, 'Specialization must be at least 3 characters'),
  qualification: z.string().min(2, 'Qualification must be at least 2 characters'),
  experience: z.coerce.number().min(0, 'Experience must be a positive number'),
  consultationFee: z.coerce.number().min(0, 'Fee must be a positive number'),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export const DoctorManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<number | null>(null);
  const [deptFilter, setDeptFilter] = useState<number | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(doctorSchema)
  });

  // Queries
  const { data: doctors, isLoading: doctorsLoading, error: doctorsError, refetch: refetchDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: doctorService.getAll
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: doctorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({ title: 'Success', description: 'Doctor profile onboarded successfully', variant: 'success' });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to onboard doctor', variant: 'danger' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DoctorFormValues }) => doctorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({ title: 'Success', description: 'Doctor profile updated successfully', variant: 'success' });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to update doctor', variant: 'danger' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: doctorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast({ title: 'Removed', description: 'Doctor profile deleted successfully', variant: 'success' });
      setDeletingDoctorId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to delete doctor', variant: 'danger' });
      setDeletingDoctorId(null);
    }
  });

  const openAddModal = () => {
    setEditingDoctor(null);
    reset({
      fullName: '',
      email: '',
      phone: '',
      departmentId: undefined,
      specialization: '',
      qualification: '',
      experience: undefined,
      consultationFee: undefined,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc: Doctor) => {
    setEditingDoctor(doc);
    setValue('fullName', doc.fullName);
    setValue('email', doc.email);
    setValue('phone', doc.phone || '');
    setValue('departmentId', doc.departmentId);
    setValue('specialization', doc.specialization);
    setValue('qualification', doc.qualification);
    setValue('experience', doc.experience);
    setValue('consultationFee', doc.consultationFee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const handleFormSubmit = (data: any) => {
    const dept = departments?.find((d: any) => d.id === Number(data.departmentId));
    const finalData = {
      ...data,
      departmentName: dept?.name || 'General'
    };

    if (editingDoctor) {
      updateMutation.mutate({ id: editingDoctor.id, data: finalData });
    } else {
      createMutation.mutate(finalData);
    }
  };

  if (doctorsLoading) return <PageLoader message="Loading medical staff registry..." />;
  if (doctorsError) return <ErrorState message={doctorsError.message} onRetry={refetchDoctors} />;

  // Filter Doctors list
  const filteredDoctors = (doctors || []).filter((doc: Doctor) => {
    if (deptFilter && doc.departmentId !== deptFilter) return false;
    return true;
  });

  const columns = [
    { 
      header: 'Doctor Name', 
      accessor: (row: Doctor) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden shrink-0">
            {row.avatarUrl ? (
              <img src={row.avatarUrl} alt={row.fullName} className="h-full w-full object-cover" />
            ) : (
              row.fullName.charAt(0)
            )}
          </div>
          <div>
            <span className="block font-bold text-slate-800 leading-tight">{row.fullName}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{row.specialization}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Department', 
      accessor: (row: Doctor) => {
        const dept = departments?.find((d: any) => d.id === row.departmentId);
        return <span className="font-semibold text-slate-600">{dept?.name || row.departmentName || 'General'}</span>;
      }
    },
    { header: 'Qualification', accessor: 'qualification' as const },
    { header: 'Experience', accessor: (row: Doctor) => `${row.experience} Yrs` },
    { header: 'Consultation Fee', accessor: (row: Doctor) => `$${row.consultationFee}` },
    { 
      header: 'Status', 
      accessor: (row: Doctor) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {row.isActive ? 'Active' : 'On Leave'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctors</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage credentials, departments, consultation fees, and profile records.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={deptFilter || ''}
            onChange={(e) => setDeptFilter(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none bg-white"
          >
            <option value="">All Departments</option>
            {departments?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Onboard Doctor</span>
          </button>
        </div>
      </div>

      {/* Grid List DataTable */}
      <DataTable
        columns={columns}
        data={filteredDoctors}
        searchPlaceholder="Search doctors by name, email or specialty..."
        searchKey="fullName"
        actions={(row: Doctor) => (
          <div className="flex justify-end gap-1">
            <button
              onClick={() => setViewingDoctor(row)}
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
              onClick={() => setDeletingDoctorId(row.id)}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      {/* DETAIL MODAL OVERLAY */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setViewingDoctor(null)}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-sm w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4 text-center">
            <button 
              onClick={() => setViewingDoctor(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mx-auto h-20 w-20 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border-2 border-slate-200 shadow-sm shrink-0">
              {viewingDoctor.avatarUrl ? (
                <img src={viewingDoctor.avatarUrl} alt={viewingDoctor.fullName} className="h-full w-full object-cover" />
              ) : (
                <Eye className="h-10 w-10 text-slate-400" />
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">{viewingDoctor.fullName}</h3>
              <p className="text-xs text-primary font-semibold uppercase tracking-wider">{viewingDoctor.specialization}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left bg-slate-50 p-4 border border-slate-100 rounded-lg text-xs leading-relaxed">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Department</span>
                <span className="font-semibold text-slate-700">
                  {departments?.find((d: any) => d.id === viewingDoctor.departmentId)?.name || viewingDoctor.departmentName}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</span>
                <span className="font-semibold text-slate-700">${viewingDoctor.consultationFee}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience</span>
                <span className="font-semibold text-slate-700">{viewingDoctor.experience} Years</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Qualifications</span>
                <span className="font-semibold text-slate-700">{viewingDoctor.qualification}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contact Email</span>
                <span className="font-semibold text-slate-700">{viewingDoctor.email}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</span>
                <span className="font-semibold text-slate-700">{viewingDoctor.phone || 'Not provided'}</span>
              </div>
            </div>
            
            <button
              onClick={() => setViewingDoctor(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Close Profile View
            </button>
          </div>
        </div>
      )}

      {/* ADD/EDIT FORM MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={closeModal}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-slate-800">
                  {editingDoctor ? 'Edit Doctor Profile' : 'Onboard New Doctor'}
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
                    placeholder="Dr. John Watson"
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
                    placeholder="watson@medicare.com"
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
                    placeholder="+1 555-0100"
                    {...register('phone')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.phone ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Department Unit</label>
                  <select
                    {...register('departmentId')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none bg-white focus:ring-1 focus:ring-primary/20 ${
                      errors.departmentId ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments?.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.departmentId && <p className="text-red-500 text-[10px] mt-1">{errors.departmentId.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist"
                    {...register('specialization')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.specialization ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.specialization && <p className="text-red-500 text-[10px] mt-1">{errors.specialization.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Qualifications</label>
                  <input
                    type="text"
                    placeholder="e.g. MD, PhD"
                    {...register('qualification')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.qualification ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.qualification && <p className="text-red-500 text-[10px] mt-1">{errors.qualification.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Experience (Years)</label>
                  <input
                    type="number"
                    placeholder="8"
                    {...register('experience')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.experience ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.experience && <p className="text-red-500 text-[10px] mt-1">{errors.experience.message as string}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Consultation Fee ($)</label>
                  <input
                    type="number"
                    placeholder="100"
                    {...register('consultationFee')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.consultationFee ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.consultationFee && <p className="text-red-500 text-[10px] mt-1">{errors.consultationFee.message as string}</p>}
                </div>
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
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingDoctorId !== null}
        title="Delete Doctor Profile"
        description="Are you sure you want to delete this doctor? All scheduled consultations and patient appointments under this doctor will be flagged for restructuring."
        confirmText="Yes, Delete"
        onConfirm={() => deletingDoctorId && deleteMutation.mutate(deletingDoctorId)}
        onCancel={() => setDeletingDoctorId(null)}
      />

    </div>
  );
};
export default DoctorManagementPage;
