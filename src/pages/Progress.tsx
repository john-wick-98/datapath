import { useApp, getModuleMastery, getWeakTopics, getStreak } from '../store/AppStore';
import { modules, allTopics } from '../data/modules';
import Heatmap from '../components/Heatmap';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export default function Progress() {
  const { state } = useApp();
  const streak = getStreak(state);
  const weakTopics = getWeakTopics(state, allTopics);
  const moduleMasteries = modules.map(m => ({ name: m.title, mastery: getModuleMastery(state, m.topics.map(t => t.projectId)), icon: m.icon }));
  const mockTestData = state.mockTestHistory.map((t, i) => ({ test: `Test ${i + 1}`, score: t.overallScore }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Progress</h1><p className="text-sm text-gray-500">Track your mastery, streak, and areas to improve</p></div>
      <div className="card">
        <h2 className="font-bold text-sm mb-4">Module Mastery</h2>
        <div className="space-y-3">
          {moduleMasteries.map(m => (
            <div key={m.name}>
              <div className="flex justify-between text-sm mb-1"><span>{m.icon} {m.name}</span><span className="font-medium">{m.mastery}%</span></div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${m.mastery >= 80 ? 'bg-green-500' : m.mastery >= 50 ? 'bg-accent' : 'bg-amber-400'}`} style={{ width: `${m.mastery}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      {mockTestData.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-sm mb-4">Mock Test Score Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockTestData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="test" tick={{ fontSize: 12 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center"><span className="text-3xl font-bold text-accent">{streak}</span><p className="text-sm text-gray-500">Current Streak</p></div>
        <div className="card text-center"><span className="text-3xl font-bold text-accent">{state.daysActive}</span><p className="text-sm text-gray-500">Total Active Days</p></div>
        <div className="card text-center"><span className="text-3xl font-bold text-accent">{state.mockTestHistory.length}</span><p className="text-sm text-gray-500">Mock Tests Taken</p></div>
      </div>
      <div className="card"><h2 className="font-bold text-sm mb-4">Activity Heatmap</h2><Heatmap dates={state.activeDates} /></div>
      <div className="card">
        <h2 className="font-bold text-sm mb-3">Weak Topics (pass-rate below 60%)</h2>
        {weakTopics.length === 0 ? <p className="text-sm text-gray-400">No weak topics yet. Complete some practice projects to see analysis.</p> : (
          <div className="space-y-2">{weakTopics.map(t => { const m = modules.find(m => m.id === t.moduleId); return (<div key={t.topicId} className="flex items-center justify-between text-sm"><span>{t.title} <span className="text-gray-400">({m?.title})</span></span><span className="text-amber-600 font-medium">{Math.round(t.passRate * 100)}%</span></div>); })}</div>
        )}
      </div>
    </div>
  );
}
