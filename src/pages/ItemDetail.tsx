import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Share2,
  Bookmark,
  ShieldCheck,
  QrCode,
  MessageSquare,
  Sparkles,
  Phone,
  ArrowLeft,
  AlertTriangle,
  Award,
  CheckCircle2,
  Tag,
  Maximize2,
  DollarSign
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, toggleBookmark, createClaim, reportItem, findSmartMatchesForItem } = useData();

  const item = items.find((i) => i.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Claim Form State
  const [claimReason, setClaimReason] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [contactNumber, setContactNumber] = useState(currentUser?.whatsapp_number || '+919876543210');
  const [proofUrl, setProofUrl] = useState('');

  // Report Safety State
  const [reportReason, setReportReason] = useState<'SPAM' | 'FAKE_LISTING' | 'OFFENSIVE' | 'DUPLICATE' | 'WRONG_CATEGORY' | 'OTHER'>('SPAM');
  const [reportDetails, setReportDetails] = useState('');

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Item Report Not Found</h2>
        <p className="text-xs text-slate-500">The item you are searching for might have been resolved or deleted.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </div>
    );
  }

  const smartMatches = findSmartMatchesForItem(item);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimReason || !identifyingDetails) return;

    createClaim({
      item_id: item.id,
      claimant_id: currentUser?.id || 'user-1',
      claimant_profile: currentUser || undefined,
      owner_id: item.user_id,
      owner_profile: item.user_profile,
      reason: claimReason,
      identifying_details: identifyingDetails,
      proof_image_url: proofUrl || undefined,
      contact_number: contactNumber
    });

    setClaimModalOpen(false);
    navigate('/claims');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportItem(item.id, currentUser?.id || 'user-1', reportReason, reportDetails);
    setReportModalOpen(false);
    alert('Report submitted successfully to Campus Security & Admins.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition-colors"
          >
            <QrCode className="w-4 h-4" /> Campus QR Code
          </button>
          <button
            onClick={() => toggleBookmark(item.id)}
            className={`p-2 rounded-xl border transition-all ${
              item.is_bookmarked
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden glass-card shadow-xl group bg-slate-900">
            <img
              src={item.images[activeImageIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            {/* Type Overlay */}
            <span
              className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-black uppercase text-white shadow-lg ${
                item.type === 'LOST' ? 'gradient-badge-lost' : 'gradient-badge-found'
              }`}
            >
              {item.type} REPORT
            </span>

            {/* Zoom Trigger */}
            <button
              onClick={() => setZoomModalOpen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-2xl bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex items-center gap-3">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-blue-600 scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* OCR Extracted Text Box */}
          {item.ocr_extracted_text && (
            <div className="glass-panel p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-500" /> OCR Verified Document Details:
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900">
                {item.ocr_extracted_text}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
            
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg">
                {item.category_name}
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Reported {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h1>

            {/* Reward Pill */}
            {item.reward_amount ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <DollarSign className="w-4 h-4 text-amber-600" /> Reward Offered: ₹{item.reward_amount}
              </div>
            ) : null}

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            {/* Location Specs */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Campus Building:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {item.building_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Specific Spot:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Floor {item.floor_number || 1} - {item.specific_location}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Primary Colors:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.primary_color || 'Standard'}</span>
              </div>
              {item.brand && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Brand:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.brand}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              {item.type === 'FOUND' && item.status === 'OPEN' && (
                <button
                  onClick={() => setClaimModalOpen(true)}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Claim This Found Item
                </button>
              )}

              <a
                href={`https://wa.me/${item.contact_whatsapp?.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors border border-emerald-200 dark:border-emerald-800/40"
              >
                <Phone className="w-4 h-4" /> Direct WhatsApp Owner ({item.contact_whatsapp})
              </a>

              <button
                onClick={() => setReportModalOpen(true)}
                className="w-full text-center text-xs text-slate-400 hover:text-red-500 pt-2 transition-colors flex items-center justify-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Flag Spam / Report Post
              </button>
            </div>

          </div>

          {/* Owner Info Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={item.user_profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="Owner"
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.user_profile?.full_name}</h4>
                  <span title="Verified Student">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </span>
                </div>
                <p className="text-xs text-slate-500">{item.user_profile?.department} • Year {item.user_profile?.year_of_study}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl">
                {item.user_profile?.reputation_points || 120} pts
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* AI Smart Matches Section */}
      {smartMatches.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
              AI Recommended Similar {item.type === 'LOST' ? 'Found' : 'Lost'} Matches
            </h3>
            <span className="text-xs text-blue-600 font-semibold">Matched by vision AI & location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {smartMatches.map((m) => (
              <div
                key={m.matchedItem.id}
                className="glass-card p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                    {m.confidenceScore}% AI Confidence
                  </span>
                  <span className="text-[10px] text-slate-400">{m.matchedItem.building_name}</span>
                </div>

                <Link to={`/item/${m.matchedItem.id}`} className="block font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600">
                  {m.matchedItem.title}
                </Link>

                <p className="text-xs text-slate-500 line-clamp-2">{m.matchedItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR CODE MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-6 max-w-sm w-full text-center space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Campus Handover QR</h3>
            <p className="text-xs text-slate-500">Scan this QR code during physical item handover verification.</p>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
              <QRCodeSVG value={item.qr_code_data || `CAMPUSFIND-${item.id}`} size={180} />
            </div>
            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              Close QR Modal
            </button>
          </div>
        </div>
      )}

      {/* CLAIM MODAL */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleClaimSubmit} className="glass-card rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" /> Verify Claim for Found Item
            </h3>
            <p className="text-xs text-slate-500">Please provide identifying details so the finder can confirm your ownership.</p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Why is this item yours? *</label>
              <textarea
                required
                rows={2}
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                placeholder="e.g. Lost it yesterday near library..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Unique Identifying Details *</label>
              <textarea
                required
                rows={2}
                value={identifyingDetails}
                onChange={(e) => setIdentifyingDetails(e.target.value)}
                placeholder="e.g. Serial number, specific key lock combination, photo lock screen wallpaper..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your WhatsApp Number *</label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClaimModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-700"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REPORT SAFETY MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleReportSubmit} className="glass-card rounded-3xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95">
            <h3 className="font-extrabold text-base text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Report Post to Admin
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              >
                <option value="SPAM">Spam / Junk Post</option>
                <option value="FAKE_LISTING">Fake / Fraud Listing</option>
                <option value="OFFENSIVE">Offensive Content</option>
                <option value="DUPLICATE">Duplicate Post</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Details</label>
              <textarea
                rows={2}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Explain the issue..."
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
