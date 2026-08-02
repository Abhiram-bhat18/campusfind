import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building as BuildingIcon, AlertCircle, CheckCircle2, ExternalLink, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';

export const CampusMap: React.FC = () => {
  const { buildings, items } = useData();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(buildings[0]?.id || null);
  const [filterType, setFilterType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');

  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  // Items for selected building
  const buildingItems = items.filter((i) => {
    const matchesBuilding = i.building_id === selectedBuildingId;
    const matchesType = filterType === 'ALL' || i.type === filterType;
    return matchesBuilding && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-8 h-8 text-blue-600 animate-bounce" /> Interactive Campus Map
          </h1>
          <p className="text-xs text-slate-500">
            Locate where lost and found belongings were reported across college campus buildings.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            All Pins
          </button>
          <button
            onClick={() => setFilterType('LOST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'LOST' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            🔴 Lost Only
          </button>
          <button
            onClick={() => setFilterType('FOUND')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'FOUND' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            🟢 Found Only
          </button>
        </div>
      </div>

      {/* Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Campus Vector Map View (SVG + Pins) */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 relative min-h-[480px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white shadow-2xl">
          
          {/* Decorative Campus Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

          {/* Top Info Overlay */}
          <div className="relative z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <BuildingIcon className="w-4 h-4" /> Main University Campus Layout
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{buildings.length} Registered Complexes</span>
          </div>

          {/* Interactive Pins SVG Layout */}
          <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {buildings.map((bld, idx) => {
              const lostCount = items.filter((i) => i.building_id === bld.id && i.type === 'LOST' && i.status === 'OPEN').length;
              const foundCount = items.filter((i) => i.building_id === bld.id && i.type === 'FOUND' && i.status === 'OPEN').length;
              const isSelected = selectedBuildingId === bld.id;

              return (
                <button
                  key={bld.id}
                  onClick={() => setSelectedBuildingId(bld.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 relative group ${
                    isSelected
                      ? 'bg-blue-600/30 border-blue-400 ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                      : 'bg-slate-900/70 border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xs">
                      {bld.code}
                    </span>

                    <div className="flex items-center gap-1">
                      {lostCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/80 text-white">
                          {lostCount} Lost
                        </span>
                      )}
                      {foundCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/80 text-white">
                          {foundCount} Found
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white mt-3 group-hover:text-blue-300 transition-colors line-clamp-1">
                    {bld.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{bld.floors} Floors Complex</p>
                </button>
              );
            })}
          </div>

          {/* Map Footer Legend */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Lost Pin</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Found Pin</span>
            </div>
            <span className="text-[11px] italic">Click building card to inspect reported items</span>
          </div>

        </div>

        {/* Right Sidebar: Items Pinned in Selected Building */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-blue-600 dark:text-blue-400">
                Selected Campus Location
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {selectedBuilding?.name || 'Campus Building'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Showing {buildingItems.length} active reports in this building.
              </p>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {buildingItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No reports logged for this building currently.
                </div>
              ) : (
                buildingItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase text-white ${
                          item.type === 'LOST' ? 'bg-red-600' : 'bg-emerald-600'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-400">Floor {item.floor_number || 1}</span>
                    </div>

                    <Link to={`/item/${item.id}`} className="block font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600">
                      {item.title}
                    </Link>

                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.specific_location}</p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{new Date(item.date_occurred).toLocaleDateString()}</span>
                      <Link to={`/item/${item.id}`} className="font-bold text-blue-600 flex items-center gap-1">
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
