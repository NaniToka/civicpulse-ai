import React, { useState } from 'react';
import {
  ThumbsUp,
  Sparkles,
  Filter,
  PlusCircle,
  Send,
  MapPin,
  Tag,
  Smile,
  CheckCircle2,
  Clock,
  User,
} from 'lucide-react';
import { Region } from '../types';

export interface CitizenComment {
  id: string;
  citizenName: string;
  districtCity: string;
  stateProvince: string;
  countryCode: string;
  type: 'POSITIVE' | 'CRITICAL' | 'SUGGESTION';
  category: string;
  commentText: string;
  rating: number; // 1-5
  likes: number;
  timestamp: string;
  isVerifiedCitizen: boolean;
}

interface CitizenFeedbackWallProps {
  regions: Region[];
}

export const CitizenFeedbackWall: React.FC<CitizenFeedbackWallProps> = ({ regions }) => {
  const seedComments: CitizenComment[] = [
    {
      id: 'FB-IND-MH-001',
      citizenName: 'Ramesh Patil',
      districtCity: 'Pune Peri-Urban District',
      stateProvince: 'Maharashtra',
      countryCode: 'IND',
      type: 'POSITIVE',
      category: 'Clean Water',
      commentText: 'Huge thanks to the municipal team for repairing the broken pipeline in Ward 12! Clean water flowing to 5,000 households again! 💧🎉👏 Excellent quick response!',
      rating: 5,
      likes: 42,
      timestamp: '10 mins ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-TG-002',
      citizenName: 'Venkatesh Rao',
      districtCity: 'Hyderabad Old City Ward',
      stateProvince: 'Telangana',
      countryCode: 'IND',
      type: 'CRITICAL',
      category: 'Clean Water',
      commentText: 'Very disappointed with night water pressure in Charminar zone. Water comes for only 20 mins at 1 AM! Families cannot stay awake every night! 🚰😡🚨 Fix the pumping grid!',
      rating: 1,
      likes: 89,
      timestamp: '35 mins ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-DL-003',
      citizenName: 'Priya Sharma',
      districtCity: 'Delhi NCR South Sector',
      stateProvince: 'Delhi NCR',
      countryCode: 'IND',
      type: 'POSITIVE',
      category: 'Transportation',
      commentText: 'New electric buses on Sangam Vihar route are awesome! Super quiet, clean, and AC works great in summer! 🚌⚡😃 Please add 50 more buses!',
      rating: 5,
      likes: 67,
      timestamp: '1 hour ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-PB-004',
      citizenName: 'Gurpreet Singh',
      districtCity: 'Ludhiana Industrial Hub',
      stateProvince: 'Punjab',
      countryCode: 'IND',
      type: 'CRITICAL',
      category: 'Sanitation & Drainage',
      commentText: 'Severe industrial effluent flooding in Focal Point Phase 5! Dark chemical wastewater filling residential streets and smells terrible! 🏭🤢🚨 Urgent action needed from PCB!',
      rating: 1,
      likes: 114,
      timestamp: '2 hours ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-UP-005',
      citizenName: 'Rajesh Kumar',
      districtCity: 'Kanpur South Belt',
      stateProvince: 'Uttar Pradesh',
      countryCode: 'IND',
      type: 'POSITIVE',
      category: 'Healthcare',
      commentText: 'Primary health center in Sector 4 received 2 new pediatric doctors today! Big relief for families with young kids! 🏥👨‍⚕️🎉 Kudos to health department!',
      rating: 4,
      likes: 53,
      timestamp: '3 hours ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-AP-006',
      citizenName: 'Subba Rao',
      districtCity: 'Ongole Coastal District',
      stateProvince: 'Andhra Pradesh',
      countryCode: 'IND',
      type: 'CRITICAL',
      category: 'Clean Water',
      commentText: 'Drinking water salinity is getting worse in Kothapatnam road area! RO purification plants urgently required for clean drinking water! 🌾🌊🚰🚨',
      rating: 2,
      likes: 76,
      timestamp: '4 hours ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-TN-007',
      citizenName: 'Karthik Subramanian',
      districtCity: 'Chennai Central North',
      stateProvince: 'Tamil Nadu',
      countryCode: 'IND',
      type: 'SUGGESTION',
      category: 'Sanitation & Drainage',
      commentText: 'Pre-monsoon canal desilting work in Vyasarpadi needs faster completion before heavy rains start! 🌧️🚜💡 Desilt all stormwater drains now!',
      rating: 3,
      likes: 38,
      timestamp: '5 hours ago',
      isVerifiedCitizen: true,
    },
    {
      id: 'FB-IND-KA-008',
      citizenName: 'Ananya Hegde',
      districtCity: 'Bengaluru East Tech Corridor',
      stateProvince: 'Karnataka',
      countryCode: 'IND',
      type: 'POSITIVE',
      category: 'Transportation',
      commentText: 'Outer Ring Road feeder bus frequency increased today! Commute time reduced by 25 mins! 🚍✨👍 Great work BMTC!',
      rating: 5,
      likes: 95,
      timestamp: '6 hours ago',
      isVerifiedCitizen: true,
    },
  ];

  const [comments, setComments] = useState<CitizenComment[]>(seedComments);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [showComposer, setShowComposer] = useState<boolean>(false);

  // New Comment Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newRegionId, setNewRegionId] = useState(regions[0]?.id || 'REG-IND-UP-KANP-02');
  const [newType, setNewType] = useState<'POSITIVE' | 'CRITICAL' | 'SUGGESTION'>('POSITIVE');
  const [newCategory, setNewCategory] = useState('Clean Water');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [postedSuccess, setPostedSuccess] = useState(false);

  const emojiList = ['🎉', '🚨', '👏', '😡', '💧', '🏥', '⚡', '🚌', '👍', '🤢', '✨', '🌊', '💡', '❤️'];

  const handleAppendEmoji = (emoji: string) => {
    setNewText((prev) => prev + ' ' + emoji);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const targetRegion = regions.find((r) => r.id === newRegionId) || regions[0];

    const createdComment: CitizenComment = {
      id: `FB-${targetRegion.country_code}-${Date.now().toString().slice(-4)}`,
      citizenName: newAuthor.trim() || 'Civic Resident',
      districtCity: targetRegion.district_city,
      stateProvince: targetRegion.state_province,
      countryCode: targetRegion.country_code,
      type: newType,
      category: newCategory,
      commentText: newText,
      rating: newRating,
      likes: 1,
      timestamp: 'Just now',
      isVerifiedCitizen: true,
    };

    setComments([createdComment, ...comments]);
    setNewText('');
    setNewAuthor('');
    setPostedSuccess(true);
    setTimeout(() => {
      setPostedSuccess(false);
      setShowComposer(false);
    }, 1500);
  };

  const handleLikeComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  const filteredComments = comments.filter((c) => {
    if (filterType !== 'ALL' && c.type !== filterType) return false;
    if (filterState !== 'ALL' && !c.stateProvince.toLowerCase().includes(filterState.toLowerCase())) return false;
    return true;
  });

  const stateOptions = Array.from(new Set(regions.map((r) => r.state_province)));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass-panel-cyan p-6 md:p-8 space-y-4 border border-cyan-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-extrabold text-cyan-300 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-700">
                LIVE COMMUNITY FEEDBACK WALL
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 font-sans">
              Indian States <span className="gradient-text-cyan">Citizen Comments & Ratings</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Real-world citizen feedback from across Indian states & districts including positive praise 🎉, critical infrastructure alerts 🚨, and constructive suggestions with rich emoji reactions.
            </p>
          </div>

          <button
            onClick={() => setShowComposer(!showComposer)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs transition shadow-lg shadow-cyan-950/80 glow-cyan cursor-pointer shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Citizen Feedback</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Post Feedback Form Modal / Drawer */}
      {showComposer && (
        <div className="p-6 rounded-2xl glass-card border-2 border-cyan-500/60 shadow-2xl space-y-5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold text-slate-100">Post New Citizen Feedback & Emojis</h3>
            </div>
            <button
              onClick={() => setShowComposer(false)}
              className="text-xs font-mono font-bold text-slate-400 hover:text-white"
            >
              Cancel ✕
            </button>
          </div>

          {postedSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Feedback posted successfully to the live Indian community wall! 🎉</span>
            </div>
          ) : (
            <form onSubmit={handleAddComment} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Your Name:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                {/* State & District Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Your District & State:</span>
                  </label>
                  <select
                    value={newRegionId}
                    onChange={(e) => setNewRegionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.district_city}, {r.state_province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feedback Type (Good / Bad / Suggestion) */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Feedback Sentiment:</span>
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'POSITIVE' | 'CRITICAL' | 'SUGGESTION')}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="POSITIVE">Good / Praise 🎉</option>
                    <option value="CRITICAL">Bad / Critical Issue 🚨</option>
                    <option value="SUGGESTION">Suggestion 💡</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Infrastructure Sector */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Infrastructure Sector:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 font-bold rounded-xl px-3.5 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="Clean Water">Clean Water 💧</option>
                    <option value="Healthcare">Healthcare 🏥</option>
                    <option value="Sanitation & Drainage">Sanitation & Drainage 🚽</option>
                    <option value="Electricity & Power">Electricity & Power ⚡</option>
                    <option value="Transportation">Transportation 🚌</option>
                    <option value="Digital Connectivity">Digital Connectivity 📶</option>
                  </select>
                </div>

                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold">Rating (1 to 5 Stars):</label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-lg transition cursor-pointer ${
                          star <= newRating ? 'text-amber-400 scale-110' : 'text-slate-700'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-slate-400 font-bold text-xs ml-2">({newRating}/5 Stars)</span>
                  </div>
                </div>
              </div>

              {/* Emoji Quick Insert Bar */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Click Emojis to Insert:</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
                  {emojiList.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => handleAppendEmoji(emoji)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 hover:border-cyan-500 border border-slate-700 text-sm transition cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold">Feedback Details & Comments:</label>
                <textarea
                  rows={3}
                  placeholder="Share details about water, road, hospital, or power conditions in your area..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 font-sans text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold transition shadow-md glow-cyan flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Citizen Comment</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Filters Bar (Good / Bad / Suggestions / State) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-card font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-300">Filter Sentiment:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterType === 'ALL'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Feedback ({comments.length})
          </button>
          <button
            onClick={() => setFilterType('POSITIVE')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              filterType === 'POSITIVE'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-300'
            }`}
          >
            <span>Good / Praise 🎉</span>
          </button>
          <button
            onClick={() => setFilterType('CRITICAL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              filterType === 'CRITICAL'
                ? 'bg-rose-950 text-rose-300 border border-rose-500'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-300'
            }`}
          >
            <span>Bad / Critical 🚨</span>
          </button>
          <button
            onClick={() => setFilterType('SUGGESTION')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
              filterType === 'SUGGESTION'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-indigo-300'
            }`}
          >
            <span>Suggestions 💡</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="font-bold text-slate-400">State:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-100 font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">All Indian States</option>
            {stateOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Live Comments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`p-5 rounded-2xl glass-card space-y-4 border transition-all duration-300 relative flex flex-col justify-between ${
              comment.type === 'POSITIVE'
                ? 'hover:border-emerald-500/80 hover:shadow-emerald-950/40'
                : comment.type === 'CRITICAL'
                ? 'hover:border-rose-500/80 hover:shadow-rose-950/40'
                : 'hover:border-indigo-500/80 hover:shadow-indigo-950/40'
            }`}
          >
            <div>
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 font-extrabold text-xs font-mono">
                    {comment.citizenName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-100 text-sm font-sans">{comment.citizenName}</span>
                      {comment.isVerifiedCitizen && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                          VERIFIED CITIZEN ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>{comment.districtCity}, {comment.stateProvince}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                    comment.type === 'POSITIVE'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : comment.type === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  }`}
                >
                  {comment.type === 'POSITIVE' ? 'GOOD PRAISE 🎉' : comment.type === 'CRITICAL' ? 'CRITICAL ALERT 🚨' : 'SUGGESTION 💡'}
                </span>
              </div>

              {/* Comment Body */}
              <div className="py-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {comment.category}
                  </span>
                  <div className="text-amber-400 font-bold">
                    {'★'.repeat(comment.rating)}
                    {'☆'.repeat(5 - comment.rating)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium pt-1">
                  "{comment.commentText}"
                </p>
              </div>
            </div>

            {/* Comment Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{comment.timestamp}</span>
              </span>

              <button
                onClick={() => handleLikeComment(comment.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500 transition font-bold cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>{comment.likes} Upvotes</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
