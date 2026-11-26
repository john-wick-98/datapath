import { useState, useRef } from 'react';
import { useApp } from '../store/AppStore';

export default function Settings() {
  const { state, dispatch } = useApp();
  const [apiKeyInput, setApiKeyInput] = useState(state.apiKey);
  const [timeBudget, setTimeBudget] = useState(state.dailyTimeBudget);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `datapath-progress-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { try { dispatch({ type: 'IMPORT_STATE', payload: JSON.parse(ev.target?.result as string) }); alert('Progress imported successfully!'); } catch { alert('Invalid JSON file.'); } };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Settings</h1><p className="text-sm text-gray-500">Configure API keys, preferences, and manage your progress</p></div>
      <div className="card space-y-3">
        <h2 className="font-bold text-sm">🔑 AI Provider & API Key</h2>
        <div>
          <label className="text-sm font-medium block mb-1">Provider</label>
          <div className="flex gap-2">
            <button onClick={() => dispatch({ type: 'SET_AI_PROVIDER', payload: 'gemini' })} className={`px-4 py-2 rounded-lg text-sm font-medium ${state.aiProvider === 'gemini' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>Google Gemini</button>
            <button onClick={() => dispatch({ type: 'SET_AI_PROVIDER', payload: 'groq' })} className={`px-4 py-2 rounded-lg text-sm font-medium ${state.aiProvider === 'groq' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>Groq</button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">API Key</label>
          <div className="flex gap-2">
            <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={state.aiProvider === 'gemini' ? 'Paste Gemini API key...' : 'Paste Groq API key...'} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent" />
            <button onClick={() => dispatch({ type: 'SET_API_KEY', payload: apiKeyInput })} className="btn btn-primary text-sm">Save</button>
          </div>
          <p className="text-xs text-gray-400 mt-1">{state.aiProvider === 'gemini' ? 'Get a free key at https://aistudio.google.com/apikey' : 'Get a free key at https://console.groq.com/keys'}</p>
          <p className="text-xs text-gray-400">Stored only in your browser (localStorage). Never sent anywhere except the AI provider.</p>
        </div>
      </div>
      <div className="card space-y-3">
        <h2 className="font-bold text-sm">⏰ Daily Time Budget</h2>
        <label className="text-sm font-medium block mb-1">Minutes per day: {timeBudget}</label>
        <input type="range" min="15" max="480" step="15" value={timeBudget} onChange={e => setTimeBudget(Number(e.target.value))} className="w-full" />
        <button onClick={() => dispatch({ type: 'SET_TIME_BUDGET', payload: timeBudget })} className="btn btn-primary text-sm mt-2">Save</button>
      </div>
      <div className="card space-y-3">
        <h2 className="font-bold text-sm">💾 Export / Import Progress</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} className="btn btn-secondary text-sm">Export JSON</button>
          <button onClick={() => fileRef.current?.click()} className="btn btn-secondary text-sm">Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
        </div>
        <p className="text-xs text-gray-400">Export your progress to a JSON file. Import to restore on another device or browser.</p>
      </div>
      <div className="card border-red-200">
        <h2 className="font-bold text-sm text-red-600">⚠️ Reset All Progress</h2>
        <p className="text-xs text-gray-500 mt-1 mb-3">This erases all data including quiz scores, checkpoint history, and settings.</p>
        <button onClick={() => { if (confirm('Are you sure? This cannot be undone.')) dispatch({ type: 'RESET_STATE' }); }} className="btn bg-red-500 text-white hover:bg-red-600 text-sm">Reset Everything</button>
      </div>
      <div className="card">
        <h2 className="font-bold text-sm mb-3">📊 Your Stats</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-400">Active Days:</span> {state.daysActive}</div>
          <div><span className="text-gray-400">Projects Attempted:</span> {Object.keys(state.checkpointHistory).length}</div>
          <div><span className="text-gray-400">Quizzes Taken:</span> {Object.keys(state.quizHistory).length}</div>
          <div><span className="text-gray-400">Mock Tests:</span> {state.mockTestHistory.length}</div>
        </div>
      </div>
    </div>
  );
}
