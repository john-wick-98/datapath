import { useState, useEffect } from 'react';
import { useApp } from '../store/AppStore';
import { modules } from '../data/modules';
import { projects } from '../data/projects';

export default function MockTests() {
  const { state, dispatch } = useApp();
  const [active, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3000);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{ overallScore: number; perModuleBreakdown: Record<number, number> } | null>(null);

  const testQuestions = modules.flatMap(m =>
    m.topics.flatMap(t => {
      const p = projects[t.projectId];
      return p ? [{ topic: t, module: m, project: p, checkpoint: p.checkpoints[0] }] : [];
    })
  ).slice(0, 15);

  useEffect(() => {
    if (active && timeLeft > 0) { const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000); return () => clearTimeout(t); }
    if (active && timeLeft === 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, timeLeft]);

  const handleStart = () => { setActive(true); setTimeLeft(3000); setAnswers({}); setResults(null); };

  const handleSubmit = () => {
    const mb: Record<number, { correct: number; total: number }> = {};
    testQuestions.forEach(q => {
      if (!mb[q.module.id]) mb[q.module.id] = { correct: 0, total: 0 };
      mb[q.module.id].total++;
      const ans = answers[q.checkpoint.id];
      if (ans && q.checkpoint.expected !== undefined) {
        if (typeof q.checkpoint.expected === 'number') {
          if (Math.abs(parseFloat(ans) - q.checkpoint.expected) < (q.checkpoint.tolerance || 0.01)) mb[q.module.id].correct++;
        } else if (typeof q.checkpoint.expected === 'string') {
          if (ans.trim() === q.checkpoint.expected) mb[q.module.id].correct++;
        }
      }
    });
    const total = Object.values(mb).reduce((a, b) => a + b.total, 0);
    const correct = Object.values(mb).reduce((a, b) => a + b.correct, 0);
    const overallScore = Math.round((correct / total) * 100);
    const perModuleBreakdown: Record<number, number> = {};
    Object.entries(mb).forEach(([id, { correct: c, total: t }]) => { perModuleBreakdown[Number(id)] = Math.round((c / t) * 100); });
    const result = { date: new Date().toISOString(), overallScore, perModuleBreakdown, duration: 3000 - timeLeft };
    dispatch({ type: 'RECORD_MOCK_TEST', payload: { result } });
    setResults({ overallScore, perModuleBreakdown }); setActive(false);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (active) return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white z-10 py-2 border-b border-gray-100 flex justify-between items-center">
        <span className="font-bold text-sm">Mock Test #{state.mockTestsUnlocked}</span>
        <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : ''}`}>⏱ {fmt(timeLeft)}</span>
      </div>
      <div className="space-y-4">
        {testQuestions.map((q, i) => (
          <div key={i} className="card">
            <p className="text-sm font-medium mb-2">Q{i + 1}. [{q.module.title}] {q.checkpoint.prompt}</p>
            {q.project.dataset.content && (
              <details className="mb-2">
                <summary className="text-xs text-gray-400 cursor-pointer">View dataset</summary>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">{q.project.dataset.content.slice(0, 300)}...</pre>
              </details>
            )}
            <input
              value={answers[q.checkpoint.id] || ''}
              onChange={e => setAnswers({ ...answers, [q.checkpoint.id]: e.target.value })}
              placeholder="Enter your answer..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-accent"
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="btn btn-primary w-full">Submit Test</button>
    </div>
  );

  if (results) return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-xl font-bold mb-2">Test Complete!</h2>
        <p className="text-4xl font-bold text-accent mb-2">{results.overallScore}%</p>
        <p className="text-sm text-gray-500">Overall Score</p>
      </div>
      <div className="card">
        <h3 className="font-bold text-sm mb-3">Per-Module Breakdown</h3>
        <div className="space-y-2">
          {Object.entries(results.perModuleBreakdown).map(([id, score]) => {
            const m = modules.find(mod => mod.id === Number(id));
            const s = Number(score);
            return (
              <div key={id} className="flex items-center justify-between text-sm">
                <span>{m?.icon} {m?.title}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${s}%` }} />
                  </div>
                  <span className="font-medium">{s}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={() => setResults(null)} className="btn btn-secondary">Back to Mock Tests</button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Mock Tests</h1>
        <p className="text-sm text-gray-500">Comprehensive tests unlocked every 10 active days</p>
      </div>
      <div className="card text-center">
        <p className="text-sm text-gray-500 mb-2">Active Days: {state.daysActive}</p>
        <p className="text-xs text-gray-400 mb-4">
          {state.mockTestsUnlocked > state.mockTestHistory.length
            ? `🎉 Mock Test #${state.mockTestsUnlocked} is unlocked!`
            : `${10 - (state.daysActive % 10 || 10)} more active days to unlock Mock Test #${state.mockTestsUnlocked + 1}`}
        </p>
        {state.mockTestsUnlocked > state.mockTestHistory.length && (
          <button onClick={handleStart} className="btn btn-primary">
            Start Mock Test #{state.mockTestsUnlocked}
          </button>
        )}
      </div>
      {state.mockTestHistory.length > 0 && (
        <div>
          <h2 className="font-bold text-sm mb-3">Test History</h2>
          <div className="space-y-2">
            {state.mockTestHistory.map((t, i) => (
              <div key={i} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Mock Test #{i + 1}</p>
                  <p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-lg font-bold ${t.overallScore >= 70 ? 'text-green-500' : t.overallScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {t.overallScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
