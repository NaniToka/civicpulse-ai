import React, { useState } from 'react';
import {
  ThumbsUp,
  Sparkles,
  Filter,
  PlusCircle,
  Send,
  MapPin,
  Smile,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Region } from '../types';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
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
  const [upvotedCommentIds, setUpvotedCommentIds] = useState<string[]>([]);

  // New Comment Form State
  const [newAuthor, setNewAuthor] = useState('');
  const [newRegionId] = useState(regions[0]?.id || 'REG-IND-UP-KANP-02');
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
    setUpvotedCommentIds([...upvotedCommentIds, createdComment.id]);
    setNewText('');
    setNewAuthor('');
    setPostedSuccess(true);
    setTimeout(() => {
      setPostedSuccess(false);
      setShowComposer(false);
    }, 1500);
  };

  const handleLikeComment = (id: string) => {
    const isAlreadyUpvoted = upvotedCommentIds.includes(id);

    if (isAlreadyUpvoted) {
      setUpvotedCommentIds((prev) => prev.filter((item) => item !== id));
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likes: Math.max(0, c.likes - 1) } : c))
      );
    } else {
      setUpvotedCommentIds((prev) => [...prev, id]);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
      );
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filterType !== 'ALL' && c.type !== filterType) return false;
    if (filterState !== 'ALL' && !c.stateProvince.toLowerCase().includes(filterState.toLowerCase())) return false;
    return true;
  });

  const stateOptions = Array.from(new Set(regions.map((r) => r.state_province)));

  return (
    <div className="space-y-8 animate-in fade-in duration-150 text-slate-950 font-bold">
      {/* 1. Header Banner */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 font-bold" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 font-mono">
                {t('wall_sub')}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 font-sans">
              {t('wall_title')}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs sm:text-sm font-extrabold">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                {t('tag_public_voice')}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                {t('tag_verified_posts')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowComposer(!showComposer)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm transition cursor-pointer shrink-0 self-start md:self-auto shadow-xs"
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>{t('btn_post_feedback')}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Post Feedback Form Modal / Drawer */}
      {showComposer && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-150 text-slate-950 font-bold">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 font-mono font-extrabold">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950">{t('btn_post_feedback')}</h3>
            </div>
            <button
              onClick={() => setShowComposer(false)}
              className="text-xs sm:text-sm font-mono text-slate-700 hover:text-slate-950 cursor-pointer font-extrabold"
            >
              Cancel ✕
            </button>
          </div>

          {postedSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-extrabold text-emerald-900 flex items-center justify-between shadow-2xs">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-700" />
                <span>Feedback posted successfully to the community wall!</span>
              </span>
              <button
                onClick={() => setPostedSuccess(false)}
                className="text-xs font-mono underline cursor-pointer"
              >
                Post Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddComment} className="space-y-4 font-mono text-xs sm:text-sm font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-slate-800 font-extrabold">Your Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none font-bold"
                    required
                  />
                </div>

                {/* Feedback Type */}
                <div className="space-y-1">
                  <label className="text-slate-800 font-extrabold">Feedback Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'POSITIVE' | 'CRITICAL' | 'SUGGESTION')}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="CRITICAL">Critical Issue / Complaint</option>
                    <option value="POSITIVE">Praise / Appreciation</option>
                    <option value="SUGGESTION">Improvement Suggestion</option>
                  </select>
                </div>

                {/* Sector */}
                <div className="space-y-1">
                  <label className="text-slate-800 font-extrabold">Sector:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none cursor-pointer font-bold"
                  >
                    <option value="Clean Water">Clean Water Grid</option>
                    <option value="Healthcare">Healthcare Facilities</option>
                    <option value="Electrical Grid & Power">Electrical Grid</option>
                    <option value="Roads & Transit">Roads & Transit</option>
                    <option value="Digital Connectivity">Digital Connectivity</option>
                    <option value="Sanitation & Drainage">Sanitation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Rating */}
                <div className="space-y-1">
                  <label className="text-slate-800 font-extrabold">Satisfaction Rating (1 to 5 Stars):</label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg p-2.5 focus:outline-none cursor-pointer font-bold"
                  >
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Below Average)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    <option value={4}>★★★★☆ (4 Stars - Good)</option>
                    <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                  </select>
                </div>
              </div>

              {/* Emoji Quick Insert Bar */}
              <div className="space-y-1.5">
                <label className="text-slate-800 font-extrabold flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-indigo-600" />
                  <span>Click Emojis to Insert in Quote:</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-100 border border-slate-200">
                  {emojiList.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => handleAppendEmoji(emoji)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-200 border border-slate-200 text-xs transition cursor-pointer font-bold"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-slate-800 font-extrabold">Feedback Details & Comments:</label>
                <textarea
                  rows={3}
                  placeholder="Share details about water, road, hospital, or power conditions in your area..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-950 font-sans text-xs sm:text-sm focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-950 font-extrabold cursor-pointer text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs sm:text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Comment</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Filters Bar (Good / Bad / Suggestions / State) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm shadow-sm font-extrabold">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600 font-extrabold" />
          <span className="text-slate-800 font-extrabold">{t('label_filter_sentiment')}</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-2 rounded-lg font-extrabold transition cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 border border-slate-200 text-slate-950 hover:bg-slate-200'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilterType('POSITIVE')}
            className={`px-3.5 py-2 rounded-lg font-extrabold transition flex items-center gap-1 cursor-pointer ${
              filterType === 'POSITIVE'
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                : 'bg-slate-100 border border-slate-200 text-slate-950 hover:bg-slate-200'
            }`}
          >
            <span>Praise</span>
          </button>
          <button
            onClick={() => setFilterType('CRITICAL')}
            className={`px-3.5 py-2 rounded-lg font-extrabold transition flex items-center gap-1 cursor-pointer ${
              filterType === 'CRITICAL'
                ? 'bg-rose-100 text-rose-950 border border-rose-300'
                : 'bg-slate-100 border border-slate-200 text-slate-950 hover:bg-slate-200'
            }`}
          >
            <span>Critical</span>
          </button>
          <button
            onClick={() => setFilterType('SUGGESTION')}
            className={`px-3.5 py-2 rounded-lg font-extrabold transition flex items-center gap-1 cursor-pointer ${
              filterType === 'SUGGESTION'
                ? 'bg-indigo-100 text-indigo-950 border border-indigo-300'
                : 'bg-slate-100 border border-slate-200 text-slate-950 hover:bg-slate-200'
            }`}
          >
            <span>Suggestions</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-slate-800 font-extrabold">{t('label_state_filter')}</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-950 text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer font-bold"
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
            className="p-5 rounded-xl bg-[#0A0A0C] border border-white/[0.12] hover:border-indigo-500/50 transition-colors shadow-md flex flex-col justify-between space-y-4 text-slate-100 font-bold"
          >
            <div>
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#121215] border border-white/[0.12] flex items-center justify-center text-indigo-400 font-extrabold text-sm font-mono shadow-2xs">
                    {comment.citizenName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base font-sans">{comment.citizenName}</span>
                      {comment.isVerifiedCitizen && (
                        <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1 mt-0.5 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{comment.districtCity}, {comment.stateProvince}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-extrabold ${
                    comment.type === 'POSITIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : comment.type === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                >
                  {comment.type === 'POSITIVE' ? 'PRAISE' : comment.type === 'CRITICAL' ? 'CRITICAL' : 'SUGGESTION'}
                </span>
              </div>

              {/* Comment Body */}
              <div className="py-3 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold">
                  <span className="text-slate-300 font-extrabold">
                    {comment.category}
                  </span>
                  <div className="text-amber-400 font-extrabold text-base">
                    {'★'.repeat(comment.rating)}
                    {'☆'.repeat(5 - comment.rating)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-1 font-bold">
                  "{comment.commentText}"
                </p>
              </div>
            </div>

            {/* Comment Footer */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs sm:text-sm font-mono text-slate-400 font-bold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>{comment.timestamp}</span>
              </span>

              {(() => {
                const isUpvoted = upvotedCommentIds.includes(comment.id);
                return (
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs sm:text-sm font-extrabold cursor-pointer ${
                      isUpvoted
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-[#121215] border-white/[0.12] text-slate-300 hover:bg-slate-800'
                    }`}
                    title={isUpvoted ? 'Remove your upvote' : 'Upvote this comment'}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{isUpvoted ? 'Upvoted' : 'Upvote'} ({comment.likes})</span>
                  </button>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
