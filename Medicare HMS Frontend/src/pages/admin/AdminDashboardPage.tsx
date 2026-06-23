import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import { PageLoader, ErrorState } from '../../components/FeedbackStates';
import { 
  Users, UserPlus, Building2, Calendar, 
  Activity, ArrowUpRight, Plus, FolderPlus, 
  ClipboardList, Settings 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) return <PageLoader message="Loading executive analytics..." />;
  if (error || !stats) return <ErrorState message={error?.message || 'Failed to fetch metrics'} onRetry={refetch} />;

  // Chart Color Constants
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back, Administrator. Hospital operations are operating normally.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/admin/appointments')}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" />
            <span>Manage Schedules</span>
          </button>
        </div>
      </div>

      {/* 2. Statistical Metric Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          subtext="vs previous month"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatCard
          title="Active Doctors"
          value={stats.totalDoctors}
          subtext="On duty today"
          icon={<UserPlus className="h-5 w-5 text-emerald-600" />}
          trend={{ value: '95% active', isPositive: true }}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          subtext="Functional units"
          icon={<Building2 className="h-5 w-5 text-amber-600" />}
        />
        <StatCard
          title="Appointments"
          value={stats.totalAppointments}
          subtext="Total slots scheduled"
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          trend={{ value: '12 pending', isPositive: false }}
        />
      </div>

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-96">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Appointment Bookings Trend</h3>
            <span className="text-xs text-slate-400 font-medium">Weekly statistics</span>
          </div>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorAppts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut distribution chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-96">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Staffing by Department</h3>
          <div className="flex-1 flex items-center justify-center text-xs relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departmentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-700">{stats.totalDoctors}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Doctors</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-4 border-t border-slate-50">
            {stats.departmentDistribution.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-500 font-medium truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Recent Activities & Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recent Activities Panel */}
        <div className="md:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Live Activity Logs</h3>
          <div className="flex-1 overflow-y-auto space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="flex gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${
                    activity.type === 'APPOINTMENT' 
                      ? 'bg-purple-500' 
                      : activity.type === 'PATIENT' 
                        ? 'bg-emerald-500' 
                        : 'bg-blue-500'
                  }`}></span>
                  <div>
                    <p className="text-slate-700 font-semibold">{activity.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">{activity.timestamp}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-semibold uppercase tracking-wider">
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Shortcuts Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Quick Administrative Tools</h3>
          <div className="grid grid-cols-1 gap-2.5 flex-1">
            <Link
              to="/admin/patients"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <Plus className="h-4.5 w-4.5 text-primary group-hover:scale-110 transition-transform" />
                <span>Register New Patient</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>
            
            <Link
              to="/admin/doctors"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <FolderPlus className="h-4.5 w-4.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Onboard Clinical Doctor</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link
              to="/admin/departments"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <Building2 className="h-4.5 w-4.5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Add Hospital Department</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
            </Link>

            <Link
              to="/admin/settings"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                <Settings className="h-4.5 w-4.5 text-slate-500 group-hover:rotate-45 transition-transform" />
                <span>Configure Hospital Limits</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-800 transition-colors" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AdminDashboardPage;
