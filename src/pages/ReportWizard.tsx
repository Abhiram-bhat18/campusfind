import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  Tag,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { analyzeItemImage, AIAnalysisOutput } from '../utils/aiEngine';
import { ItemType } from '../types';

export const ReportWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { addItem, buildings, categories } = useData();

  const initialType: ItemType = searchParams.get('type') === 'found' ? 'FOUND' : 'LOST';
  const [type, setType] = useState<ItemType>(initialType);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-1');
  const [brand, setBrand] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [buildingId, setBuildingId] = useState(buildings[0]?.id || 'bld-1');
  const [floorNumber, setFloorNumber] = useState(1);
  const [specificLocation, setSpecificLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().slice(0, 10));
  const [timeOccurred, setTimeOccurred] = useState('12:00');
  const [rewardAmount, setRewardAmount] = useState(0);
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.whatsapp_number || '+919876543210');
  const [additionalContact, setAdditionalContact] = useState('');
  
  // Tagging & Images
  const [tags, setTags] = useState<string[]>(['Campus']);
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiData, setAiData] = useState<AIAnalysisOutput | null>(null);

  // Handle File Upload & AI Vision analysis
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Trigger AI Scanner
    setIsAnalyzing(true);
    try {
      const aiResult = await analyzeItemImage(file, type, title);
      setAiData(aiResult);
      if (aiResult.predictedCategory) setCategoryId(aiResult.predictedCategory);
      if (aiResult.detectedColors.length > 0) setPrimaryColor(aiResult.detectedColors.join(' / '));
      if (aiResult.brandSuggestion) setBrand(aiResult.brandSuggestion);
      if (aiResult.suggestedTags) setTags((prev) => Array.from(new Set([...prev, ...aiResult.suggestedTags])));
      if (!description) setDescription(aiResult.generatedDescription);
    } catch (err) {
      console.warn('AI analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = addItem({
      user_id: currentUser?.id || 'user-1',
      type,
      title,
      description,
      category_id: categoryId,
      brand: brand || undefined,
      primary_color: primaryColor,
      building_id: buildingId,
      floor_number: floorNumber,
      specific_location: specificLocation || 'Main Hall',
      date_occurred: dateOccurred,
      time_occurred: timeOccurred,
      reward_amount: type === 'LOST' ? Number(rewardAmount) : 0,
      contact_whatsapp: contactWhatsapp,
      additional_contact: additionalContact,
      tags,
      images: imagePreview ? [imagePreview] : [type === 'LOST' ? 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800' : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'],
      ocr_extracted_text: aiData?.ocrText
    });

    navigate(`/item/${newItem.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Report {type === 'LOST' ? 'Lost Item' : 'Found Item'}
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Help our campus AI engine match your post by uploading photos and filling in details accurately.
        </p>

        {/* Mode Switcher Buttons */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800 mt-4">
          <button
            type="button"
            onClick={() => setType('LOST')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'LOST'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-red-500'
            }`}
          >
            🔴 I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setType('FOUND')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
              type === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-500'
            }`}
          >
            🟢 I Found Something
          </button>
        </div>
      </div>

      {/* Main Wizard Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-10 space-y-8 border border-slate-200/80 dark:border-slate-800 shadow-xl">
        
        {/* Section 1: AI Vision Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              1. Upload Photos & AI Scanner
            </h3>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Auto OCR & Tag Extraction</span>
          </div>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors relative bg-slate-50/50 dark:bg-slate-900/50">
            {imagePreview ? (
              <div className="space-y-4">
                <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-cover shadow-md" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setAiData(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2 block">
                <UploadCloud className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Click or drag photo here to scan with AI
                </p>
                <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP. Scans ID cards & documents automatically.</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-white space-y-2 animate-in fade-in">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-300" />
                <p className="text-sm font-bold">Scanning with Computer Vision AI...</p>
                <p className="text-xs text-cyan-200">Extracting colors, OCR text, and predicted tags.</p>
              </div>
            )}
          </div>

          {/* AI Detection Banner */}
          {aiData && (
            <div className="glass-panel p-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-500" />
                AI Analysis Results:
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Detected Color: <span className="font-semibold text-blue-600">{aiData.detectedColors.join(', ')}</span> | Category Prediction: <span className="font-semibold text-blue-600">Auto Selected</span>
              </p>
              {aiData.ocrText && (
                <div className="text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-emerald-600">OCR Extracted Text:</span> "{aiData.ocrText.slice(0, 150)}..."
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Basic Details */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            2. Item Basic Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apple AirPods Pro 2 in Blue Case"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Brand (Optional)
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Keychron, Nike"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Primary Colors
              </label>
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="e.g. Dark Blue, Silver"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe distinctive marks, stickers, serial numbers, or contents..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section 3: Location & Time */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            3. Campus Location & Date
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Campus Building *
              </label>
              <select
                value={buildingId}
                onChange={(e) => setBuildingId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              >
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Floor Number
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={floorNumber}
                onChange={(e) => setFloorNumber(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                Specific Location
              </label>
              <input
                type="text"
                value={specificLocation}
                onChange={(e) => setSpecificLocation(e.target.value)}
                placeholder="e.g. Lab 302, Bench 14"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" /> Date Occurred
              </label>
              <input
                type="date"
                value={dateOccurred}
                onChange={(e) => setDateOccurred(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Approximate Time
              </label>
              <input
                type="time"
                value={timeOccurred}
                onChange={(e) => setTimeOccurred(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Reward & Contact Info */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-emerald-500" />
            4. Contact & Tags
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                WhatsApp Number *
              </label>
              <input
                type="text"
                required
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {type === 'LOST' && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" /> Finder Reward (Optional ₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(Number(e.target.value))}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
              Search Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag and press Enter..."
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1"
                >
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Publish Campus {type} Report
          </button>
        </div>

      </form>
    </div>
  );
};
