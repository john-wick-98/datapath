import { useState } from 'react';
import { useApp, getWeakTopics } from '../store/AppStore';
import { modules } from '../data/modules';
import { callAI, MENTOR_SYSTEM_PROMPT, getMentorContext } from '../engines/aiEngine';

export default function MentorWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useApp();

  const allTopics = modules.flatMap(m => m.topics.map(t => ({ id: t.id, title: t.title, moduleId: m.id, projectId: t.projectId })));
  const weakTopics = getWeakTopics(state, allTopics);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'user', content: userMsg } });
    setLoading(true);
    try {
      const ctx = getMentorContext(state, weakTopics);
      const response = await callAI(state.aiProvider, state.apiKey, MENTOR_SYSTEM_PROMPT + ctx + '\n\nUser: ' + userMsg);
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: response } });
    } catch (e: any) {
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: `⚠️ ${e.message}` } });
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:bg-accent-dark flex items-center justify-center text-2xl transition-all"
        title="Mentor Chat">
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div><h3 className="font-bold text-sm">Mentor</h3><p className="text-xs text-gray-500">AI career coach</p></div>
            <button onClick={() => dispatch({ type: 'CLEAR_CHAT' })} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {state.chatHistory.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                <p className="mb-2">👋 Hi! I'm your AI career coach.</p>
                <p>Ask me about SQL, Excel, interviews, resumes, or your learning path.</p>
              </div>
            )}
            {state.chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.content}</div>
              </div>
            ))}
            {loading && <div className="text-center text-gray-400 text-sm">Thinking...</div>}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
            <button onClick={sendMessage} disabled={loading} className="btn btn-primary px-3 py-2 text-sm">→</button>
          </div>
        </div>
      )}
    </>
  );
}
