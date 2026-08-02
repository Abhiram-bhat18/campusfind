import React, { useState } from 'react';
import {
  Shield,
  BarChart2,
  Users,
  AlertTriangle,
  Megaphone,
  Download,
  CheckCircle2,
  XCircle,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { INITIAL_USERS } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { items, announcements, addAnnouncement, notifications } = useData();

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'NORMAL' | 'URGENT' | 'EVENT'>('NORMAL');

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'USERS' | 'REPORTS' | 'ANNOUNCEMENTS'>('ANALYTICS');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    addAnnouncement(annTitle, annContent, annPriority);
    setAnnTitle('');
    setAnnContent('');
    alert('Campus announcement broadcasted successfully!');
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Title,Type,Status,Building,Date\n' +
      items.map((i) => `${i.id},"${i.title}",${i.type},${i.status},"${i.building_name}",${i.date_occurred}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'CampusFind_Report_Summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-indigo-500" /> Campus Safety & Admin Panel
          </h1>
          <p className="text-xs text-slate-500">
            System administration, user verification, safety reports, analytics, and broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200"
          >
            <Download className="w-4 h-4" /> Export CSV Reports
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ANALYTICS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 inline mr-1" /> Analytics & Trends
        </button>
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'USERS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1" /> User Moderation ({INITIAL_USERS.length})
        </button>
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'REPORTS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> Safety Flag Log
        </button>
        <button
          onClick={() => setActiveTab('ANNOUNCEMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ANNOUNCEMENTS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 inline mr-1" /> Announcements ({announcements.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">Lost vs Found Breakdown</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {items.filter((i) => i.type === 'LOST').length} / {items.filter((i) => i.type === 'FOUND').length}
              </p>
              <p className="text-xs text-slate-400">Ratio: ~1:1 recovery index</p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">Average Resolution Time</span>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">18.4 Hours</p>
              <p className="text-xs text-slate-400">Fast AI matching efficiency</p>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase">Most Active Hotspot</span>
              <p className="text-xl font-black text-blue-600 dark:text-blue-400">Main Campus Library</p>
              <p className="text-xs text-slate-400">38% of campus reports</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS */}
      {activeTab === 'USERS' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Verified Campus Students</h3>
          <div className="space-y-3">
            {INITIAL_USERS.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{user.full_name}</h4>
                    <p className="text-xs text-slate-500">{user.email} • {user.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    ID Verified
                  </span>
                  <button className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600">
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SAFETY REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Moderation Queue</h3>
          <p className="text-xs text-slate-500">No active spam or offensive posts reported today. All clear!</p>
        </div>
      )}

      {/* TAB 4: ANNOUNCEMENTS */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-6">
          <form onSubmit={handleBroadcast} className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-500" /> Broadcast Campus Announcement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="e.g. Lost & Found Counter Active at SAC"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                <select
                  value={annPriority}
                  onChange={(e) => setAnnPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                >
                  <option value="NORMAL">Normal Broadcast</option>
                  <option value="URGENT">Urgent Campus Alert</option>
                  <option value="EVENT">Event Specific</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Message Content</label>
              <textarea
                required
                rows={3}
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Content will be broadcasted to top feed..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md">
              Publish Announcement
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
