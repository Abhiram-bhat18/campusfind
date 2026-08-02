import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  Trophy,
  Star,
  CheckCircle2,
  Phone,
  Building,
  Calendar,
  Edit2,
  Check,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { INITIAL_USERS } from '../data/mockData';

export const UserProfileView: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { items } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp_number || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  const myPosts = items.filter((i) => i.user_id === currentUser?.id || i.user_id === 'user-1');
  const activePosts = myPosts.filter((i) => i.status === 'OPEN');
  const resolvedPosts = myPosts.filter((i) => i.status === 'RESOLVED' || i.status === 'CLAIMED');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      department,
      whatsapp_number: whatsapp,
      bio
    });
    setIsEditing(false);
  };

  // Sort Leaderboard
  const leaderboardUsers = [...INITIAL_USERS].sort((a, b) => b.reputation_points - a.reputation_points);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Profile Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Background Radiant Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt="Avatar"
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-500/40 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentUser?.full_name}
                </h1>
                {currentUser?.is_verified && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.department} • Year {currentUser?.year_of_study} • ID: {currentUser?.student_id || 'CS2023-8849'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-lg">
                "{currentUser?.bio || 'Campus student keeping our university community connected.'}"
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>

        </div>

        {/* Edit Profile Form Popup */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bio</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">
              Save Changes
            </button>
          </form>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="text-center p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20">
            <span className="text-xs text-slate-500 font-semibold">Reputation Points</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{currentUser?.reputation_points || 180} pts</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20">
            <span className="text-xs text-slate-500 font-semibold">Resolved Returns</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{resolvedPosts.length + 5}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20">
            <span className="text-xs text-slate-500 font-semibold">Active Reports</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{activePosts.length}</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20">
            <span className="text-xs text-slate-500 font-semibold">Success Rate</span>
            <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">94%</p>
          </div>
        </div>

      </div>

      {/* Gamification Badges & Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Earned Badges */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Earned Badges & Achievements
          </h2>

          <div className="space-y-3">
            {currentUser?.badges?.map((b) => (
              <div key={b.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{b.name}</h4>
                  <p className="text-[11px] text-slate-500">{b.description}</p>
                </div>
              </div>
            )) || (
              <p className="text-xs text-slate-400">Complete items handovers to unlock badges!</p>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Monthly Campus Leaderboard
          </h2>

          <div className="space-y-2">
            {leaderboardUsers.map((u, idx) => (
              <div
                key={u.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-extrabold text-xs ${idx === 0 ? 'text-amber-500 text-sm' : 'text-slate-400'}`}>
                    #{idx + 1}
                  </span>
                  <img src={u.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{u.full_name}</h4>
                    <p className="text-[10px] text-slate-400">{u.department}</p>
                  </div>
                </div>

                <span className="font-black text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-xl">
                  {u.reputation_points} pts
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
