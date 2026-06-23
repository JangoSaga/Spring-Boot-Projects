import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../../services/api';
import { Department } from '../../store/slices/departmentSlice';
import { DataTable } from '../../components/DataTable';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit2, Trash2, X, Activity } from 'lucide-react';

const deptSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
  description: z.string().min(5, 'Description must be at least 5 characters'),
});

type DeptFormValues = z.infer<typeof deptSchema>;

export const DepartmentManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deletingDeptId, setDeletingDeptId] = useState<number | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DeptFormValues>({
    resolver: zodResolver(deptSchema)
  });

  // Query Fetching
  const { data: departments, isLoading, error, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({ title: 'Success', description: 'Department created successfully', variant: 'success' });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to create department', variant: 'danger' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DeptFormValues }) => departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({ title: 'Success', description: 'Department updated successfully', variant: 'success' });
      closeModal();
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to update department', variant: 'danger' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast({ title: 'Deleted', description: 'Department removed from registry', variant: 'success' });
      setDeletingDeptId(null);
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to delete department', variant: 'danger' });
      setDeletingDeptId(null);
    }
  });

  const openAddModal = () => {
    setEditingDept(null);
    reset({ name: '', code: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setValue('name', dept.name);
    setValue('code', dept.code);
    setValue('description', dept.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const handleFormSubmit = (data: DeptFormValues) => {
    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <PageLoader message="Loading hospital departments..." />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const columns = [
    { header: 'Dept Code', accessor: 'code' as const, className: 'font-semibold text-slate-800 w-28' },
    { header: 'Department Name', accessor: 'name' as const, className: 'font-bold text-slate-700 w-48' },
    { header: 'Description', accessor: 'description' as const, className: 'text-slate-400 font-normal max-w-xs truncate' },
    { 
      header: 'Status', 
      accessor: (row: Department) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Departments</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and organize hospital specialty functional units.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={departments || []}
        searchPlaceholder="Search departments by name or code..."
        searchKey="name"
        actions={(row: Department) => (
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => openEditModal(row)}
              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeletingDeptId(row.id)}
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      />

      {/* ADD/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={closeModal}></div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-md w-full p-6 relative z-10 animate-fade-in flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-slate-800">
                  {editingDept ? 'Edit Department' : 'Create Department'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Department Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    {...register('name')}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Code</label>
                  <input
                    type="text"
                    placeholder="CARD"
                    {...register('code')}
                    className={`w-full px-3 py-2 border rounded-lg uppercase focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                      errors.code ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                    }`}
                  />
                  {errors.code && <p className="text-red-500 text-[10px] mt-1">{errors.code.message}</p>}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Specialty department overview..."
                  {...register('description')}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 ${
                    errors.description ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
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
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingDeptId !== null}
        title="Delete Department"
        description="Are you absolutely sure you want to remove this department? This action will archive all clinical logs relating to this unit."
        confirmText="Yes, Delete"
        onConfirm={() => deletingDeptId && deleteMutation.mutate(deletingDeptId)}
        onCancel={() => setDeletingDeptId(null)}
      />

    </div>
  );
};
export default DepartmentManagementPage;
