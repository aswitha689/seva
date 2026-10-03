import React, { useState, useEffect } from 'react';
import { Application, ApplicationStage } from '../types/application';
import { getApplications, updateApplicationStatus, sendCitizenNotification } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Bot,
  Eye,
  Search,
  Filter,
  ArrowRight,
  Send,
  Bell,
  Building,
  Sparkles,
  ShieldAlert,
  X
} from 'lucide-react';

interface AdminProps {
  onNavigate: (route: string, params?: any) => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const { addNotification } = useNotification();

  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form states for status update
  const [newStage, setNewStage] = useState<ApplicationStage>('department_review');
  const [officerNote, setOfficerNote] = useState('');
  const [customNotificationMsg, setCustomNotificationMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadApps = () => {
    const list = getApplications();
    setApplications(list);
    if (selectedApp) {
      const updatedSelected = list.find((a) => a.id === selectedApp.id);
      if (updatedSelected) setSelectedApp(updatedSelected);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchQuery =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Calculate metrics (labeled: simulated demo data)
  const totalAppsCount = applications.length;
  const pendingCount = applications.filter((a) => a.status !== 'completed').length;
  const completedCount = applications.filter((a) => a.status === 'completed').length;

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsUpdating(true);
    const updated = updateApplicationStatus(
      selectedApp.id,
      newStage,
      officerNote.trim() || `Status updated to ${newStage.replace('_', ' ').toUpperCase()} by District Welfare Desk.`
    );

    if (updated) {
      setSelectedApp(updated);
      loadApps();
      addNotification({
        type: 'success',
        title: 'Status Updated & Citizen Notified',
        message: `Application ${selectedApp.id} moved to ${newStage.replace('_', ' ').toUpperCase()}. SMS alert sent to ${selectedApp.phone}.`,
      });
      setOfficerNote('');
    }
    setIsUpdating(false);
  };

  const handleSendCustomNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !customNotificationMsg.trim()) return;

    const updated = sendCitizenNotification(selectedApp.id, customNotificationMsg.trim());
    if (updated) {
      setSelectedApp(updated);
      loadApps();
      addNotification({
        type: 'info',
        title: 'Citizen Notification Sent',
        message: `Direct notice dispatched to ${selectedApp.citizenName}: "${customNotificationMsg.trim()}"`,
      });
      setCustomNotificationMsg('');
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Department Administrative Portal</span>
            <span>•</span>
            <span className="text-emerald-700">Welfare Review Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Department Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review citizen submissions, verify uploaded certificates, update workflow stages, and broadcast notifications.
          </p>
        </div>

        {/* Demo data badge */}
        <div className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
          Simulated Demo Data
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Citizens</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">1,482</span>
          <span className="block text-[10px] text-slate-400 font-mono">simulated demo data</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Applications</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{totalAppsCount}</span>
          <span className="block text-[10px] text-slate-400 font-mono">localStorage live</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-700">{pendingCount}</span>
          <span className="block text-[10px] text-slate-400 font-mono">localStorage live</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl font-black text-teal-700">{completedCount}</span>
          <span className="block text-[10px] text-slate-400 font-mono">localStorage live</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">AI Journeys</span>
            <Bot className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-indigo-700">92%</span>
          <span className="block text-[10px] text-slate-400 font-mono">simulated demo data</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Accessibility</span>
            <Eye className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-black text-purple-700">38%</span>
          <span className="block text-[10px] text-slate-400 font-mono">simulated demo data</span>
        </div>
      </div>

      {/* Main Content: Table + Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications Table (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search citizen name, ID, or scheme..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="all">All Stages</option>
                <option value="submitted">Submitted</option>
                <option value="documents_received">Docs Received</option>
                <option value="department_review">Review</option>
                <option value="decision">Decision</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Application ID</th>
                    <th className="px-5 py-3.5">Citizen</th>
                    <th className="px-5 py-3.5">Scheme</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => {
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <tr
                        key={app.id}
                        onClick={() => {
                          setSelectedApp(app);
                          setNewStage(app.status);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-5 py-4 font-mono font-bold text-slate-900">
                          {app.id}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900 block">{app.citizenName}</span>
                          <span className="text-[11px] text-slate-400">{app.district || app.state}</span>
                        </td>
                        <td className="px-5 py-4 max-w-[200px] truncate">
                          <span className="font-medium text-slate-800 block truncate">{app.serviceName}</span>
                          <span className="text-[10px] text-slate-400">{app.category}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              app.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'decision'
                                ? 'bg-indigo-100 text-indigo-800'
                                : app.status === 'department_review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail & Action Pane (Right 1 col) */}
        <div className="space-y-6">
          {selectedApp ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 font-mono">
                    {selectedApp.id}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{selectedApp.citizenName}</h3>
                </div>
                <button
                  onClick={() => onNavigate('track', { searchId: selectedApp.id })}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
                >
                  <span>Citizen View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Citizen Bio */}
              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Age & Gender:</span>
                  <span className="font-semibold text-slate-800">{selectedApp.age} yrs, {selectedApp.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobile Phone:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedApp.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Income:</span>
                  <span className="font-semibold text-slate-800">₹{selectedApp.annualIncome.toLocaleString('en-IN')} / yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Occupation:</span>
                  <span className="font-semibold text-slate-800">{selectedApp.occupation}</span>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Verified Uploaded Documents:</span>
                <div className="space-y-1.5">
                  {selectedApp.uploadedDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-between text-[11px]"
                    >
                      <span className="font-semibold">{doc.docName}</span>
                      <span className="text-emerald-700 font-mono">Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="space-y-3 pt-3 border-t border-slate-100">
                <span className="font-bold text-xs text-slate-900 block">Update Official Workflow Stage:</span>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value as ApplicationStage)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                >
                  <option value="submitted">1. Submitted</option>
                  <option value="documents_received">2. Documents Scrutiny Complete</option>
                  <option value="department_review">3. Department Officer Review</option>
                  <option value="decision">4. Sanction Order Approved</option>
                  <option value="completed">5. Benefit Disbursed / Completed</option>
                </select>

                <textarea
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Official desk review note (e.g. Bonafide verified with registrar. Recommended for sanction.)..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 h-20 resize-none font-medium"
                />

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Update Status & Notify Citizen</span>
                </button>
              </form>

              {/* Custom SMS / Notification Broadcast */}
              <form onSubmit={handleSendCustomNotification} className="space-y-2 pt-3 border-t border-slate-100">
                <span className="font-bold text-xs text-slate-900 block flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                  <span>Send Direct Citizen Notification:</span>
                </span>
                <input
                  type="text"
                  value={customNotificationMsg}
                  onChange={(e) => setCustomNotificationMsg(e.target.value)}
                  placeholder="e.g. Your ₹15,000 DBT grant will be credited by 5 PM today."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!customNotificationMsg.trim()}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS Alert</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                Select an application from the table to view details, update stages, or dispatch citizen SMS notifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
