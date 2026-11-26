import { useState } from 'react';
import { useApp } from '../store/AppStore';
import { placementPrepSections, companyQuestions } from '../data/placementPrep';
import { callAI, gradeWithAI } from '../engines/aiEngine';
import Markdown from '../components/Markdown';

export default function PlacementPrep() {
  const { state } = useApp();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const section = placementPrepSections.find(s => s.id === activeSection);

  const handleSubmit = async () => {
    if (!input.trim() || !section) return;
    setLoading(true); setFeedback('');
    try {
      if (section.type === 'ai-review') {
        const result = await gradeWithAI(state.aiProvider, state.apiKey, input, section.rubric || 'Evaluate as a data analyst submission.', ['Overall quality and relevance']);
        setFeedback(result.feedback);
      } else if (section.type === 'ai-chat') {
        const newMsgs = [...chatMessages, { role: 'user' as const, content: input }];
        setChatMessages(newMsgs);
        const prompt = `${section.content}\n\nConversation:\n${newMsgs.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nRespond as the interviewer:`;
        const response = await callAI(state.aiProvider, state.apiKey, prompt);
        setChatMessages([...newMsgs, { role: 'assistant', content: response }]);
      }
    } catch (e: any) { setFeedback(`⚠️ ${e.message}`); }
    setInput(''); setLoading(false);
  };

  if (section) return (
    <div className="space-y-6">
      <button onClick={() => setActiveSection(null)} className="text-sm text-gray-500 hover:text-accent">← Back to Placement Prep</button>
      <div><h1 className="text-2xl font-bold flex items-center gap-2"><span>{section.icon}</span>{section.title}</h1><p className="text-sm text-gray-500 mt-1">{section.description}</p></div>
      {section.type === 'static' && section.id === 'company-bank' ? (
        <div className="space-y-4">{companyQuestions.map(cq => (<div key={cq.company} className="card"><h3 className="font-bold text-sm">{cq.company} — {cq.role}</h3><ul className="mt-2 space-y-1">{cq.questions.map((q, i) => <li key={i} className="text-sm text-gray-700 list-disc list-inside">{q}</li>)}</ul></div>))}</div>
      ) : section.type === 'static' ? (
        <div className="card"><Markdown content={section.content} /></div>
      ) : section.type === 'ai-chat' ? (
        <div className="space-y-4">
          <div className="card text-sm text-gray-600">{section.content}</div>
          {chatMessages.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-gray-100'}`}>{msg.content}</div></div>))}
          <div className="flex gap-2"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Type your response..." rows={3} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" /><button onClick={handleSubmit} disabled={loading} className="btn btn-primary self-end">{loading ? '...' : 'Send'}</button></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card text-sm text-gray-600">{section.content}</div>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste your content here..." rows={8} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">{loading ? 'Evaluating...' : 'Get AI Feedback'}</button>
          {feedback && <div className="card bg-amber-50 border-amber-200"><pre className="text-sm whitespace-pre-wrap font-sans">{feedback}</pre></div>}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Placement Prep</h1><p className="text-sm text-gray-500">Everything you need to crack data analyst interviews in India</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {placementPrepSections.map(s => (
          <button key={s.id} onClick={() => { setActiveSection(s.id); setInput(''); setFeedback(''); setChatMessages([]); }} className="card text-left hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3"><span className="text-2xl">{s.icon}</span><div><h3 className="font-bold text-sm">{s.title}</h3><p className="text-xs text-gray-500 mt-1">{s.description}</p>{s.type === 'ai-review' && <span className="text-xs text-amber-500 mt-1 block">🤖 AI-powered</span>}{s.type === 'ai-chat' && <span className="text-xs text-blue-500 mt-1 block">💬 Interactive</span>}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}
