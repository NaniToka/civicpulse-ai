import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Square,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Flame,
  AlertTriangle,
  TestTube2,
  FileText,
  Compass,
} from 'lucide-react';
import { api } from '../services/api';
import {
  CopilotChatMessage,
  CopilotChatResponse,
  CopilotActionLink,
  CopilotEvidenceRef,
  PriorityRecommendation,
  Region,
} from '../types';
import { NavTab } from '../components/layout/Sidebar';
import { useLanguage } from '../context/LanguageContext';

interface CopilotViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenEvidenceModal?: (rec: PriorityRecommendation) => void;
  currentRegion?: Region | null;
  recommendations?: PriorityRecommendation[];
}

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  ai_provider?: string;
  evidence?: CopilotEvidenceRef[];
  action_link?: CopilotActionLink | null;
  suggested_actions?: string[];
}

const STARTER_PROMPTS = [
  {
    icon: <FileText className="w-4 h-4 text-indigo-400" />,
    title: 'How to Submit a Complaint',
    prompt: 'How to post a complaint or submit a civic signal?',
    category: 'Guide',
  },
  {
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    title: 'Most Urgent Problem',
    prompt: 'Which civic problem needs attention most urgently?',
    category: 'Priorities',
  },
  {
    icon: <Compass className="w-4 h-4 text-indigo-400" />,
    title: 'Regional Priority Reasoning',
    prompt: 'Why is Vijayawada ranked as a high-priority region?',
    category: 'Evidence',
  },
  {
    icon: <Flame className="w-4 h-4 text-rose-400" />,
    title: 'Infrastructure Deficits',
    prompt: 'Show me the largest infrastructure gaps.',
    category: 'Deficits',
  },
  {
    icon: <BarChart3 className="w-4 h-4 text-green-400" />,
    title: 'CivicFund Funding Gaps',
    prompt: 'Which projects currently have the largest funding gaps?',
    category: 'Capital Investments',
  },
  {
    icon: <TestTube2 className="w-4 h-4 text-purple-400" />,
    title: '$15M Healthcare Scenario',
    prompt: 'What happens if we allocate $15M to healthcare?',
    category: 'What-If Simulation',
  },
];

export const CopilotView: React.FC<CopilotViewProps> = ({
  onNavigate,
  onOpenEvidenceModal,
  recommendations = [],
}) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [aiProviderBadge, setAiProviderBadge] = useState<string>('Gemini 1.5 Flash');
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    api.getHealth()
      .then((res) => {
        setAiProviderBadge(res.ai_provider === 'gemini' ? 'Gemini 1.5 Flash' : 'Rule-Based Fallback');
      })
      .catch(() => {
        setAiProviderBadge('Rule-Based Fallback');
      });
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || loading) return;

    const userMsg: DisplayMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const historyForApi: CopilotChatMessage[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res: CopilotChatResponse = await api.sendCopilotChat({
        message: query,
        conversation_id: 'session-copilot',
        history: historyForApi,
        context: {
          route: '/copilot',
        },
      });

      const assistantMsg: DisplayMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: res.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ai_provider: res.ai_provider,
        evidence: res.evidence,
        action_link: res.action_link,
        suggested_actions: res.suggested_actions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: DisplayMessage = {
        id: `assistant-fallback-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered a temporary connection issue. Please try submitting your question again or explore the top priority recommendations tab.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ai_provider: 'rule_based_fallback',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputMessage('');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  const handleExecuteActionLink = (action: CopilotActionLink) => {
    if (action.action_type === 'open_modal' && onOpenEvidenceModal) {
      const rec = recommendations.find((r) => r.id === action.target);
      if (rec) {
        onOpenEvidenceModal(rec);
        return;
      }
    }
    if (action.target.startsWith('/')) {
      const tabMap: Record<string, NavTab> = {
        '/dashboard': 'dashboard',
        '/demand': 'demand',
        '/hotspots': 'hotspots',
        '/gaps': 'gaps',
        '/recommendations': 'recommendations',
        '/evidence': 'evidence',
        '/scenarios': 'scenarios',
        '/data': 'data',
      };
      const targetTab = tabMap[action.target] || 'recommendations';
      onNavigate(targetTab);
    }
  };

  const renderMarkdownText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-extrabold text-slate-950 mt-4 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 font-bold" />
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-sm sm:text-base font-extrabold text-indigo-700 mt-3 mb-1.5">
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        const itemText = line.substring(2);
        return (
          <li key={idx} className="text-sm sm:text-base text-slate-950 font-bold ml-4 list-disc space-y-1.5">
            {itemText}
          </li>
        );
      }
      if (!line.trim()) return <div key={idx} className="h-2" />;
      return (
        <p key={idx} className="text-sm sm:text-base text-slate-950 font-bold leading-relaxed my-1">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 font-extrabold">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950">
                {t('copilot_title')}
              </h2>
              <span className="text-xs font-mono font-extrabold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                CIVIC COPILOT
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-bold">
              {t('copilot_sub')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-700 font-bold">AI Engine:</span>
            <span className="font-mono text-slate-950 font-extrabold">{aiProviderBadge}</span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-700 hover:text-red-700 hover:border-red-300 transition cursor-pointer font-extrabold"
              title="Clear current conversation"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden xs:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto flex flex-col space-y-4 relative min-h-0 shadow-sm">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center space-y-6 py-6 px-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-extrabold">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-950">
                {t('copilot_welcome')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-bold">
                {t('copilot_welcome_sub')}
              </p>
            </div>

            <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
              {STARTER_PROMPTS.map((promptItem, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(promptItem.prompt)}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition cursor-pointer flex flex-col justify-between group space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {promptItem.icon}
                    </div>
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-200 text-slate-800 group-hover:text-indigo-800">
                      {promptItem.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 group-hover:text-indigo-700 transition-colors">
                      {promptItem.title}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-normal font-bold">
                      "{promptItem.prompt}"
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5 font-extrabold shadow-2xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[88%] sm:max-w-[82%] space-y-3.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble Container */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border text-sm sm:text-base ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none shadow-md font-extrabold'
                        : 'bg-slate-50 text-slate-950 border-slate-300 rounded-tl-none shadow-xs font-bold'
                    }`}
                  >
                    {renderMarkdownText(msg.content)}

                    {/* Evidence Ref Box if present */}
                    {msg.evidence && msg.evidence.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Grounded Evidence Citations</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {msg.evidence.map((ev, evIdx) => (
                            <div key={evIdx} className="p-2 rounded-md bg-white border border-slate-200 flex items-center justify-between text-xs shadow-2xs">
                              <span className="text-slate-800 font-semibold truncate">{ev.title}</span>
                              <span className="font-mono text-indigo-700 font-bold text-[11px] ml-2 shrink-0">{ev.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button Link */}
                    {msg.action_link && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                        <button
                          onClick={() => handleExecuteActionLink(msg.action_link!)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer shadow-xs"
                        >
                          <span>{msg.action_link.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Actions Pills */}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggested_actions.map((act, actIdx) => (
                        <button
                          key={actIdx}
                          onClick={() => handleSendMessage(act)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-indigo-300 hover:bg-indigo-50 transition cursor-pointer flex items-center gap-1 font-semibold"
                        >
                          <span>{act}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Assistant Footer Controls */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 px-1 font-medium">
                      <span>{msg.timestamp}</span>
                      <span>•</span>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600 font-bold" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={handleRegenerate}
                        className="hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
                        title="Regenerate response"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                    YOU
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 font-bold">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2 font-medium shadow-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-slate-600 font-mono text-[11px] font-semibold">Evaluating grounded CivicPulse intelligence data...</span>
                  <button
                    onClick={handleStopGenerating}
                    className="ml-3 p-1 rounded bg-white border border-slate-300 text-slate-600 hover:text-slate-900 transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                    title="Stop generation"
                  >
                    <Square className="w-3 h-3 text-red-600 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Bottom Input Composer */}
      <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-3 shrink-0 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about urgent problems, evidence trails, funding gaps, or $15M healthcare scenarios..."
              rows={1}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg py-2.5 px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none min-h-[42px] max-h-[120px] font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition cursor-pointer shrink-0 flex items-center justify-center shadow-xs"
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1 font-medium">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="font-mono text-slate-700 font-bold">Enter</kbd> to send</span>
            <span>•</span>
            <span><kbd className="font-mono text-slate-700 font-bold">Shift + Enter</kbd> for new line</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600 font-semibold">
            <HelpCircle className="w-3 h-3 text-indigo-600" />
            <span>Grounded AI Boundary Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
