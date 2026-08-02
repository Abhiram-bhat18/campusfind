import React from 'react';
import { Search, Filter, RotateCcw, Building, Tag, Calendar, CheckCircle, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { FilterState } from '../types';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, categories, buildings } = useData();

  return (
    <div className="glass-panel rounded-3xl p-5 mb-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          placeholder="Search items, tags, ID roll numbers, brands, or location... (e.g. AirPods, CS2023-8849, Library)"
          className="w-full pl-11 pr-28 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
            className="absolute right-3 top-3 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Filter Chips: Type Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, type: 'ALL' }))}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.type === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
            }`}
          >
            All Reports
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, type: 'LOST' }))}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.type === 'LOST'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-red-600'
            }`}
          >
            🔴 Lost Items
          </button>
          <button
            onClick={() => setFilters((prev) => ({ ...prev, type: 'FOUND' }))}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.type === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600'
            }`}
          >
            🟢 Found Items
          </button>
        </div>

        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
        
        {/* Category Dropdown */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-blue-500" /> Category
          </label>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters((prev) => ({ ...prev, categoryId: e.target.value }))}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Building Dropdown */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Building className="w-3 h-3 text-indigo-500" /> Campus Location
          </label>
          <select
            value={filters.buildingId}
            onChange={(e) => setFilters((prev) => ({ ...prev, buildingId: e.target.value }))}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Buildings</option>
            {buildings.map((bld) => (
              <option key={bld.id} value={bld.id}>
                {bld.name} ({bld.code})
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Dropdown */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-500" /> Date Occurred
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value as FilterState['dateRange'] }))}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Today</option>
            <option value="WEEK">Past 7 Days</option>
            <option value="MONTH">Past 30 Days</option>
          </select>
        </div>

        {/* Status & Sort */}
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" /> Item Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as FilterState['status'] }))}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open Reports Only</option>
            <option value="CLAIMED">In Verification</option>
            <option value="RESOLVED">Returned & Resolved</option>
          </select>
        </div>

      </div>

      {/* Suggested Quick Tags */}
      <div className="flex items-center gap-2 pt-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Popular Tags:
        </span>
        {['AirPods', 'Student ID', 'Wallet', 'Keychron', 'Calculators', 'Library Bench'].map((tag) => (
          <button
            key={tag}
            onClick={() => setFilters((prev) => ({ ...prev, searchQuery: tag }))}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium shrink-0 transition-colors"
          >
            #{tag}
          </button>
        ))}
      </div>

    </div>
  );
};
