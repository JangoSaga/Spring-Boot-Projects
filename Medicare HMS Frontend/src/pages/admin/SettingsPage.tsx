import React from 'react';
import { Settings, Save, ShieldAlert, Key, Globe, Eye } from 'lucide-react';
import { useToast } from '../../components/Toast';

export const SettingsPage: React.FC = () => {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings Saved',
      description: 'System configurations updated on server successfully.',
      variant: 'success'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <h1 className="text-xl font-bold text-slate-800">System Settings</h1>
            <p className="text-xs text-slate-400 mt-0.5">Configure hospital constraints, rules, and safety thresholds.</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        
        {/* Core Hospital Limits */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
            <Globe className="h-4.5 w-4.5 text-slate-400" />
            <span>Consultation Rules</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block font-semibold text-slate-500 uppercase tracking-wider">Maximum Daily Appointments/Doctor</label>
              <input type="number" defaultValue={25} className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-slate-500 uppercase tracking-wider">Default Consultation Slot Duration</label>
              <select defaultValue="20" className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none bg-white">
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b pb-2 flex items-center gap-1.5">
            <Key className="h-4.5 w-4.5 text-slate-400" />
            <span>Security Thresholds</span>
          </h3>
          <div className="space-y-3 leading-relaxed text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" defaultChecked className="text-primary rounded focus:ring-primary h-4 w-4" />
              <span>Enforce JWT Token Expiration and Refresh (2 hours expiry)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" defaultChecked className="text-primary rounded focus:ring-primary h-4 w-4" />
              <span>Enable Audited System Operation Logs</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-semibold">
              <input type="checkbox" className="text-primary rounded focus:ring-primary h-4 w-4" />
              <span>Restrict Patient registration to verified email loops only</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            <span>Save System Rules</span>
          </button>
        </div>

      </form>

    </div>
  );
};
export default SettingsPage;
