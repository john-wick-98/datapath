import { useState } from 'react';
import { useApp, getWeakTopics } from '../store/AppStore';
import { allTopics } from '../data/modules';
import { callAI, MENTOR_SYSTEM_PROMPT, getMentorContext } from '../engines/aiEngine';

export default function Mentor() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const weakTopics = getWeakTopics(state, allTopics);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput('');
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'user', content: userMsg } });
    setLoading(true);
    try {
      const ctx = getMentorContext(state, weakTopics);
      const response = await callAI(state.aiProvider, state.apiKey, MENTOR_SYSTEM_PROMPT + ctx + '\n\nUser: ' + userMsg);
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: response } });
    } catch (e: any) { dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { role: 'assistant', content: `⚠️ ${e.message}` } }); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold mb-1">🤖 Mentor Chat</h1><p className="text-sm text-gray-500">Your AI career coach for Indian data analytics job seeking</p></div>
      <div className="card flex-1 overflow-y-auto space-y-3" style={{ minHeight: '400px', maxHeight: '60vh' }}>
        {state.chatHistory.length === 0 && (<div className="text-center text-gray-400 text-sm py-8"><p className="mb-2">👋 Start a conversation with your AI mentor.</p><p>Ask about learning paths, interview prep, resume tips, or any analytics topic.</p>{!state.apiKey && <p className="text-amber-500 mt-3">⚠️ Set your API key in Settings to enable AI responses.</p>}</div>)}
        {state.chatHistory.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.content}</div></div>))}
        {loading && <div className="text-center text-gray-400 text-sm">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask anything..." rows={2} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent resize-none" />
        <button onClick={sendMessage} disabled={loading} className="btn btn-primary self-end">{loading ? '...' : 'Send'}</button>
      </div>
      <button onClick={() => dispatch({ type: 'CLEAR_CHAT' })} className="text-xs text-gray-400 hover:text-gray-600">Clear conversation</button>
    </div>
  );
}
