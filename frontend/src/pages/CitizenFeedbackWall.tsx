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
  const [upvotedCommentIds, setUpvotedCommentIds] = useState<string[]>([]);

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
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header Banner */}
      <div className="rounded-xl bg-[#0A0A0C] border border-white/[0.08] p-6 md:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Community Feedback Wall
              </span>
            </div>
            <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-slate-100 font-sans">
              Indian States <span className="hero-gradient-text">Citizen Comments & Ratings</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
                Verified Citizen Wall
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#121215] border border-white/[0.08] text-slate-300 font-medium">
                7 Native Languages
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowComposer(!showComposer)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition cursor-pointer shrink-0 self-start md:self-auto shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Feedback</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Post Feedback Form Modal / Drawer */}
      {showComposer && (
        <div className="p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] shadow-lg space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-100">Post New Citizen Feedback</h3>
            </div>
            <button
              onClick={() => setShowComposer(false)}
              className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel ✕
            </button>
          </div>

          {postedSuccess ? (
            <div className="p-3.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Feedback posted successfully to the community wall!</span>
            </div>
          ) : (
            <form onSubmit={handleAddComment} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Author Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Your Name:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-white/[0.16]"
                    required
                  />
                </div>

                {/* State & District Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Your District & State:</span>
                  </label>
                  <select
                    value={newRegionId}
                    onChange={(e) => setNewRegionId(e.target.value)}
                    className="w-full bg-[#121215] border border-white/[0.08] text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.id} className="bg-[#121215]">
                        {r.district_city}, {r.state_province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feedback Type */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Feedback Sentiment:</span>
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'POSITIVE' | 'CRITICAL' | 'SUGGESTION')}
                    className="w-full bg-[#121215] border border-white/[0.08] text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="POSITIVE" className="bg-[#121215]">Positive Praise</option>
                    <option value="CRITICAL" className="bg-[#121215]">Critical Issue</option>
                    <option value="SUGGESTION" className="bg-[#121215]">Suggestion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Infrastructure Sector */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Infrastructure Sector:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#121215] border border-white/[0.08] text-slate-100 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                  >
                    <option value="Clean Water" className="bg-[#121215]">Clean Water</option>
                    <option value="Healthcare" className="bg-[#121215]">Healthcare</option>
                    <option value="Sanitation & Drainage" className="bg-[#121215]">Sanitation & Drainage</option>
                    <option value="Electricity & Power" className="bg-[#121215]">Electricity & Power</option>
                    <option value="Transportation" className="bg-[#121215]">Transportation</option>
                    <option value="Digital Connectivity" className="bg-[#121215]">Digital Connectivity</option>
                  </select>
                </div>

                {/* Star Rating */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-medium">Rating (1 to 5 Stars):</label>
                  <div className="flex items-center gap-2 pt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={`text-base transition cursor-pointer ${
                          star <= newRating ? 'text-amber-400' : 'text-slate-600'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-slate-400 text-xs ml-1">({newRating}/5 Stars)</span>
                  </div>
                </div>
              </div>

              {/* Emoji Quick Insert Bar */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Click Emojis to Insert in Quote:</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-[#121215] border border-white/[0.08]">
                  {emojiList.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => handleAppendEmoji(emoji)}
                      className="p-1 rounded bg-[#0A0A0C] hover:bg-[#101014] border border-white/[0.08] text-xs transition cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Feedback Details & Comments:</label>
                <textarea
                  rows={3}
                  placeholder="Share details about water, road, hospital, or power conditions in your area..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full bg-[#121215] border border-white/[0.08] rounded-lg p-3 text-slate-100 font-sans text-xs focus:outline-none focus:border-white/[0.16]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Comment</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 3. Filters Bar (Good / Bad / Suggestions / State) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0A0C] border border-white/[0.08] font-mono text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-400 font-medium">Filter Sentiment:</span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#121215] border border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setFilterType('POSITIVE')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
              filterType === 'POSITIVE'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-[#121215] border border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
            }`}
          >
            <span>Praise</span>
          </button>
          <button
            onClick={() => setFilterType('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
              filterType === 'CRITICAL'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-[#121215] border border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
            }`}
          >
            <span>Critical</span>
          </button>
          <button
            onClick={() => setFilterType('SUGGESTION')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
              filterType === 'SUGGESTION'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                : 'bg-[#121215] border border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
            }`}
          >
            <span>Suggestions</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-slate-400 font-medium">State:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-[#121215] border border-white/[0.08] text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
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
            className="p-5 rounded-xl bg-[#0A0A0C] border border-white/[0.08] hover:border-white/[0.16] transition-colors shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Comment Header */}
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#121215] border border-white/[0.08] flex items-center justify-center text-indigo-400 font-semibold text-xs font-mono">
                    {comment.citizenName[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-sm font-sans">{comment.citizenName}</span>
                      {comment.isVerifiedCitizen && (
                        <span className="text-[9px] font-mono font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>{comment.districtCity}, {comment.stateProvince}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-medium ${
                    comment.type === 'POSITIVE'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : comment.type === 'CRITICAL'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                >
                  {comment.type === 'POSITIVE' ? 'PRAISE' : comment.type === 'CRITICAL' ? 'CRITICAL' : 'SUGGESTION'}
                </span>
              </div>

              {/* Comment Body */}
              <div className="py-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-medium">
                    {comment.category}
                  </span>
                  <div className="text-amber-400">
                    {'★'.repeat(comment.rating)}
                    {'☆'.repeat(5 - comment.rating)}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pt-1">
                  "{comment.commentText}"
                </p>
              </div>
            </div>

            {/* Comment Footer */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{comment.timestamp}</span>
              </span>

              {(() => {
                const isUpvoted = upvotedCommentIds.includes(comment.id);
                return (
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors text-xs font-medium cursor-pointer ${
                      isUpvoted
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-[#121215] border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
                    }`}
                    title={isUpvoted ? 'Remove your upvote' : 'Upvote this comment'}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
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
