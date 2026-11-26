import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diagnosticQuestions } from '../data/quiz';
import { useApp } from '../store/AppStore';

export default function DiagnosticQuiz() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const q = diagnosticQuestions[current];
  const isLast = current === diagnosticQuestions.length - 1;

  const handleSubmit = () => {
    const moduleScores: Record<number, { correct: number; total: number }> = {};
    diagnosticQuestions.forEach(dq => {
      if (!moduleScores[dq.moduleId]) moduleScores[dq.moduleId] = { correct: 0, total: 0 };
      moduleScores[dq.moduleId].total++;
      if (answers[dq.id] === dq.correctIndex) moduleScores[dq.moduleId].correct++;
    });
    const results: Record<number, number> = {};
    Object.entries(moduleScores).forEach(([id, { correct, total }]) => { results[Number(id)] = Math.round((correct / total) * 100); });
    dispatch({ type: 'SET_DIAGNOSTIC', payload: { results } });
    dispatch({ type: 'INCREMENT_DAY' });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛤️</div>
          <h1 className="text-2xl font-bold text-accent">DataPath</h1>
          <p className="text-sm text-gray-500 mt-1">Diagnostic Placement Quiz</p>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">ℹ️ This is a one-time snapshot to gauge your current knowledge across 9 modules. It sets initial recommendations — not true ongoing adaptivity (no backend for that).</p>
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-400">Question {current + 1} of {diagnosticQuestions.length}</span>
            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((current + 1) / diagnosticQuestions.length) * 100}%` }} /></div>
          </div>
          <p className="font-medium text-sm mb-4">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <button key={oi} onClick={() => setAnswers({ ...answers, [q.id]: oi })}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors ${answers[q.id] === oi ? 'bg-accent/10 border-accent text-accent-dark' : 'border-gray-200 hover:border-gray-300'}`}>{opt}</button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="btn btn-secondary text-sm disabled:opacity-30">← Previous</button>
            {isLast ? (
              <button onClick={handleSubmit} disabled={Object.keys(answers).length < diagnosticQuestions.length} className="btn btn-primary text-sm">Submit & Start Learning →</button>
            ) : (
              <button onClick={() => setCurrent(current + 1)} disabled={answers[q.id] === undefined} className="btn btn-primary text-sm">Next →</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
