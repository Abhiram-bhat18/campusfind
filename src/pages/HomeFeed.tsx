import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Grid,
  List as ListIcon,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ItemCard } from '../components/ItemCard';
import { FilterBar } from '../components/FilterBar';
import { fuzzySearchItems } from '../utils/aiEngine';

export const HomeFeed: React.FC = () => {
  const { items, filters, announcements } = useData();
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  // Stats calculation
  const totalLost = items.filter((i) => i.type === 'LOST').length;
  const totalFound = items.filter((i) => i.type === 'FOUND').length;
  const totalResolved = items.filter((i) => i.status === 'RESOLVED' || i.status === 'CLAIMED').length;
  const recoveryRate = items.length > 0 ? Math.round((totalResolved / items.length) * 100) : 100;

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Filter by type
    if (filters.type !== 'ALL') {
      result = result.filter((i) => i.type === filters.type);
    }

    // Filter by category
    if (filters.categoryId !== 'ALL') {
      result = result.filter((i) => i.category_id === filters.categoryId);
    }

    // Filter by building
    if (filters.buildingId !== 'ALL') {
      result = result.filter((i) => i.building_id === filters.buildingId);
    }

    // Filter by status
    if (filters.status !== 'ALL') {
      result = result.filter((i) => i.status === filters.status);
    }

    // Filter by Date
    if (filters.dateRange !== 'ALL') {
      const now = new Date();
      result = result.filter((i) => {
        const itemDate = new Date(i.date_occurred);
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (filters.dateRange === 'TODAY') return diffDays <= 1;
        if (filters.dateRange === 'WEEK') return diffDays <= 7;
        if (filters.dateRange === 'MONTH') return diffDays <= 30;
        return true;
      });
    }

    // Fuzzy Search Query
    if (filters.searchQuery) {
      result = fuzzySearchItems(result, filters.searchQuery);
    }

    // Sorting
    if (filters.sortBy === 'OLDEST') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [items, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner with Radiant Gradient & Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl gradient-blue-hero text-white p-8 md:p-12 shadow-2xl shadow-blue-500/20">
        
        {/* Background Decorative Glow */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-64 h-64 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
            AI-Powered Smart Campus Recovery Platform
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Lost Something on Campus? <br />
            <span className="bg-gradient-to-r from-cyan-200 via-blue-100 to-white bg-clip-text text-transparent">
              CampusFind Will Help You Recover It Fast.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
            Report lost belongings, list found items, and let our vision AI match descriptions, tags, and student ID cards in real time across all college campus buildings.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/report-lost"
              className="px-6 py-3 rounded-2xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-red-600" />
              Report Lost Item
            </Link>
            <Link
              to="/report-found"
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-900/30 transition-transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Report Found Item
            </Link>
            <Link
              to="/map"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white font-semibold text-sm transition-all"
            >
              Explore Campus Map
            </Link>
          </div>

        </div>
      </div>

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                {announcements[0].title}
              </h4>
              <span className="text-[10px] text-amber-600 font-medium">{new Date(announcements[0].created_at).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-0.5">{announcements[0].content}</p>
          </div>
        </div>
      )}

      {/* Metrics & Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card rounded-2xl p-5 border border-red-200/50 dark:border-red-900/30 bg-gradient-to-br from-red-50/50 to-transparent dark:from-red-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Total Lost</span>
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalLost}</p>
          <p className="text-[11px] text-slate-500 mt-1">Active lost reports</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-200/50 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Found</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalFound}</p>
          <p className="text-[11px] text-slate-500 mt-1">Found items awaiting claim</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-blue-200/50 dark:border-blue-900/30 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Successfully Returned</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{totalResolved}</p>
          <p className="text-[11px] text-slate-500 mt-1">Verified handovers</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-cyan-200/50 dark:border-cyan-900/30 bg-gradient-to-br from-cyan-50/50 to-transparent dark:from-cyan-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Campus Recovery Rate</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{recoveryRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">Platform efficiency</p>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <FilterBar />

      {/* Grid Controls Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Campus Reports <span className="text-xs font-medium text-slate-400">({filteredItems.length} items)</span>
        </h2>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('GRID')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'GRID' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'LIST' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Items List / Grid View */}
      {filteredItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-500 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Matching Items Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing selected category filters, or check another campus building location.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'GRID'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
};
