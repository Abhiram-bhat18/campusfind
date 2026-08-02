import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Bookmark,
  Share2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Item } from '../types';
import { useData } from '../context/DataContext';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { toggleBookmark } = useData();
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/item/${item.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(item.id);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/60 dark:hover:border-blue-500/60 transition-all duration-300">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Type Badge (Lost vs Found) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase text-white shadow-md ${
              item.type === 'LOST'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/30'
            }`}
          >
            {item.type}
          </span>
          {item.status === 'RESOLVED' && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Resolved
            </span>
          )}
        </div>

        {/* AI Confidence Badge */}
        {item.ai_confidence_score && (
          <div className="absolute top-3 right-3 glass-panel px-2.5 py-1 rounded-full text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-blue-500" />
            {Math.round(item.ai_confidence_score * 100)}% AI Verified
          </div>
        )}

        {/* Action Overlay Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              item.is_bookmarked
                ? 'bg-amber-500 text-white'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white'
            }`}
            title="Bookmark Item"
          >
            <Bookmark className={`w-4 h-4 ${item.is_bookmarked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white backdrop-blur-md transition-all shadow-md"
            title="Share Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {copied && (
          <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold animate-in fade-in">
            Link Copied to Clipboard!
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Category & Time */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md">
              <Tag className="w-3 h-3" />
              {item.category_name || 'Category'}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {new Date(item.date_occurred).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Title */}
          <Link to={`/item/${item.id}`} className="block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 mb-1.5">
              {item.title}
            </h3>
          </Link>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>

          {/* Building Location */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-xl mb-3">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{item.building_name} ({item.specific_location})</span>
          </div>

        </div>

        {/* Footer info: Owner & Details Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={item.user_profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt="Owner"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
              {item.user_profile?.full_name || 'Campus Student'}
            </span>
            {item.user_profile?.is_verified && (
              <span title="Verified Student">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </span>
            )}
          </div>

          <Link
            to={`/item/${item.id}`}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            Details <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
};
