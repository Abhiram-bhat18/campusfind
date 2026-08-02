import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  ExternalLink,
  Award,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const ClaimsPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const { claims, updateClaimStatus, updateItemStatus } = useData();

  const [activeTab, setActiveTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');

  // Filter claims based on tab
  const filteredClaims = claims.filter((c) => {
    if (activeTab === 'RECEIVED') {
      return c.owner_id === currentUser?.id || c.owner_id === 'user-1' || c.owner_id === 'user-2';
    } else {
      return c.claimant_id === currentUser?.id;
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500" /> Claims & Handover Verification
          </h1>
          <p className="text-xs text-slate-500">
            Review claim requests for found items, verify ownership details, and safely coordinate handover.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('RECEIVED')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'RECEIVED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Received Claims
          </button>
          <button
            onClick={() => setActiveTab('SENT')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SENT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            My Submitted Claims
          </button>
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No {activeTab} Claims Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When students submit verification claims for found items, they will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm"
            >
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                
                <div className="flex items-center gap-3">
                  <img
                    src={claim.claimant_profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Claimant"
                    className="w-10 h-10 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Claimant: {claim.claimant_profile?.full_name || 'Campus Student'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {claim.claimant_profile?.department} • Contact: {claim.contact_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      claim.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : claim.status === 'REJECTED'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    STATUS: {claim.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(claim.created_at).toLocaleDateString()}
                  </span>
                </div>

              </div>

              {/* Item Info Summary */}
              <div className="bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-600">Claim Target Item</span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{claim.item?.title || 'Item Report'}</h4>
                </div>
                <Link
                  to={`/item/${claim.item_id}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold text-xs flex items-center gap-1"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Claim Verification Answers */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Reason for Claim:</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{claim.reason}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Identifying Proof Details:</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">{claim.identifying_details}</p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to={`/messages?claimId=${claim.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-700 shadow-md"
                >
                  <MessageSquare className="w-4 h-4" /> Open In-App Chat
                </Link>

                {activeTab === 'RECEIVED' && claim.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateClaimStatus(claim.id, 'REJECTED')}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-bold text-xs hover:bg-red-200 flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject Claim
                    </button>
                    <button
                      onClick={() => updateClaimStatus(claim.id, 'ACCEPTED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Verify Owner
                    </button>
                  </div>
                )}

                {claim.status === 'ACCEPTED' && (
                  <button
                    onClick={() => updateItemStatus(claim.item_id, 'RESOLVED')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-md hover:bg-amber-600"
                  >
                    <Award className="w-4 h-4" /> Mark Item Resolved & Award Points 🎉
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
