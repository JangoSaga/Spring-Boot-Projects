import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { 
  Menu, X, Bell, User as UserIcon, LogOut, 
  LayoutDashboard, Building2, UserPlus, Users, 
  Calendar, FileText, Settings, Database, Activity, ChevronRight 
} from 'lucide-react';
import { isMockMode, setMockMode } from '../services/api';
import { useToast } from '../components/Toast';

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mockActive, setMockActive] = useState(isMockMode());

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
      variant: 'info'
    });
    navigate('/login');
  };

  const toggleMockData = () => {
    const nextState = !mockActive;
    setMockActive(nextState);
    setMockMode(nextState);
    toast({
      title: nextState ? 'Mock Data Mode Active' : 'Live Backend Mode Active',
      description: nextState 
        ? 'App is currently running on localized mock tables.' 
        : 'App will attempt to contact live backend at http://localhost:8080.',
      variant: nextState ? 'warning' : 'success'
    });
    // Hard refresh page to clear cache and reload data
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // Define Links based on role
  const adminLinks: SidebarLink[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Departments', path: '/admin/departments', icon: <Building2 className="h-5 w-5" /> },
    { label: 'Doctors', path: '/admin/doctors', icon: <UserPlus className="h-5 w-5" /> },
    { label: 'Patients', path: '/admin/patients', icon: <Users className="h-5 w-5" /> },
    { label: 'Appointments', path: '/admin/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Medical Records', path: '/admin/medical-records', icon: <FileText className="h-5 w-5" /> },
    { label: 'Profile', path: '/admin/profile', icon: <UserIcon className="h-5 w-5" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const doctorLinks: SidebarLink[] = [
    { label: 'Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'My Appointments', path: '/doctor/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'My Patients', path: '/doctor/patients', icon: <Users className="h-5 w-5" /> },
    { label: 'Medical Records', path: '/doctor/medical-records', icon: <FileText className="h-5 w-5" /> },
    { label: 'Profile', path: '/doctor/profile', icon: <UserIcon className="h-5 w-5" /> },
  ];

  const patientLinks: SidebarLink[] = [
    { label: 'Dashboard', path: '/patient/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Book Appointment', path: '/patient/book-appointment', icon: <Calendar className="h-5 w-5" /> },
    { label: 'My Appointments', path: '/patient/appointments', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Medical Records', path: '/patient/medical-records', icon: <FileText className="h-5 w-5" /> },
    { label: 'Profile', path: '/patient/profile', icon: <UserIcon className="h-5 w-5" /> },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'DOCTOR' ? doctorLinks : patientLinks;

  // Breadcrumbs Generation
  const pathnames = location.pathname.split('/').filter(x => x);
  const breadcrumbs = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    const isLast = index === pathnames.length - 1;
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
      path: routeTo,
      isLast
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300 shrink-0">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2 shrink-0">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-white text-lg tracking-wide">MediCare HMS</span>
        </div>
        
        {/* Links List */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/10' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate leading-none mt-1">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE COLLAPSIBLE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop overlay */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          
          <aside className="relative flex flex-col w-64 bg-slate-900 text-slate-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-heading font-bold text-white text-lg">MediCare HMS</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {links.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-sm font-medium text-slate-400 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN WORKSPACE CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 relative shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-800">
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Mock Database indicator switch */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMockData}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold select-none transition-colors border ${
                  mockActive 
                    ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Database className="h-3 w-3" />
                <span>{mockActive ? 'Mock Database Active' : 'Live API Mode'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }} 
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-20">
                    <h3 className="px-4 py-2 text-sm font-semibold text-slate-800 border-b border-slate-100">Notifications</h3>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-medium text-slate-700">Dr. Sarah Jenkins updated prescription</p>
                        <span className="text-[10px] text-slate-400">10 mins ago</span>
                      </div>
                      <div className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-medium text-slate-700">Appointment scheduled for 10:00 AM tomorrow</p>
                        <span className="text-[10px] text-slate-400">2 hours ago</span>
                      </div>
                      <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-medium text-slate-700">System maintenance at 2:00 AM</p>
                        <span className="text-[10px] text-slate-400">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }} 
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {user?.fullName?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-700">{user?.fullName}</span>
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-20">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{role} Portal</span>
                    </div>
                    <Link 
                      to={`/${role.toLowerCase()}/profile`} 
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* DYNAMIC MAIN LAYOUT WORKSPACE */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Breadcrumb bar */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 select-none">
              <span>Home</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <span className={crumb.isLast ? 'text-slate-600 font-medium' : ''}>{crumb.name}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
