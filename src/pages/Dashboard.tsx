import { Link } from 'react-router-dom';
import { useApp, getModuleMastery, getWeakTopics, getStreak } from '../store/AppStore';
import { modules, allTopics } from '../data/modules';
import ProgressRing from '../components/ProgressRing';

export default function Dashboard() {
  const { state } = useApp();
  const moduleMasteries = modules.map(m => ({ ...m, mastery: getModuleMastery(state, m.topics.map(t => t.projectId)) }));
  const overallMastery = Math.round(moduleMasteries.reduce((a, m) => a + m.mastery, 0) / moduleMasteries.length);
  const weakTopics = getWeakTopics(state, allTopics);
  const streak = getStreak(state);
  const recommendedModule = weakTopics.length > 0
    ? modules.find(m => m.id === weakTopics[0].moduleId)
    : modules.find(m => { const ms = state.moduleStates[m.id]; return !ms || m.topics.some(t => !ms.topicsVisited.includes(t.id)); }) || modules[0];
  const nextMockTest = state.mockTestsUnlocked > state.mockTestHistory.length
    ? `Mock Test #${state.mockTestsUnlocked} unlocked!`
    : `${10 - (state.daysActive % 10 || 10)} active days to next mock test`;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Dashboard</h1><p className="text-sm text-gray-500">Your analytics career journey at a glance</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex flex-col items-center"><ProgressRing progress={overallMastery} /><p className="text-sm text-gray-500 mt-2">Overall Mastery</p></div>
        <div className="card flex flex-col items-center justify-center"><span className="text-3xl font-bold text-accent">{streak}</span><p className="text-sm text-gray-500">Day Streak</p></div>
        <div className="card flex flex-col items-center justify-center"><span className="text-3xl font-bold text-accent">{state.daysActive}</span><p className="text-sm text-gray-500">Active Days</p></div>
      </div>
      <div className="card bg-accent/5 border-accent/20">
        <div className="flex items-center justify-between">
          <div><p className="text-xs text-accent font-medium uppercase tracking-wide mb-1">Today's Focus</p><h3 className="font-bold">{recommendedModule?.title}</h3><p className="text-sm text-gray-600 mt-1">{recommendedModule?.description}</p></div>
          <Link to={`/modules/${recommendedModule?.id}`} className="btn btn-primary text-sm whitespace-nowrap">Start →</Link>
        </div>
      </div>
      <div className="card flex items-center justify-between">
        <div><p className="text-sm font-medium">📝 {nextMockTest}</p>{state.mockTestHistory.length > 0 && <p className="text-xs text-gray-500 mt-1">Last score: {state.mockTestHistory[state.mockTestHistory.length - 1].overallScore}%</p>}</div>
        <Link to="/mock-tests" className="btn btn-secondary text-sm">View</Link>
      </div>
      <div>
        <h2 className="font-bold text-sm mb-3">Module Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {moduleMasteries.map(m => {
            const ms = state.moduleStates[m.id];
            const status = ms?.manualKnown || m.mastery >= 80 ? 'Known' : m.mastery > 0 ? 'Learning' : 'To Learn';
            const sc = status === 'Known' ? 'bg-green-100 text-green-700' : status === 'Learning' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500';
            return (
              <Link key={m.id} to={`/modules/${m.id}`} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2"><span className="text-xl">{m.icon}</span><span className={`text-xs px-2 py-0.5 rounded-full ${sc}`}>{status}</span></div>
                <h3 className="font-medium text-sm">{m.title}</h3>
                <div className="mt-2"><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${m.mastery}%` }} /></div><span className="text-xs text-gray-400 mt-1 block">{m.mastery}% mastery</span></div>
              </Link>
            );
          })}
        </div>
      </div>
      {weakTopics.length > 0 && (
        <div className="card border-amber-200 bg-amber-50">
          <h2 className="font-bold text-sm mb-2">⚠️ Weak Topics</h2>
          <div className="space-y-2">
            {weakTopics.slice(0, 5).map(t => { const m = modules.find(m => m.id === t.moduleId); return (
              <Link key={t.topicId} to={`/modules/${t.moduleId}/${t.topicId}`} className="flex items-center justify-between text-sm hover:underline">
                <span>{t.title} <span className="text-gray-400">({m?.title})</span></span><span className="text-amber-600 font-medium">{Math.round(t.passRate * 100)}%</span>
              </Link>
            ); })}
          </div>
        </div>
      )}
    </div>
  );
}
