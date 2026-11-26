import { useState } from 'react';
import { QuizQuestion } from '../types';
import { useApp } from '../store/AppStore';

export default function QuizComponent({ topicId, questions }: { topicId: string; questions: QuizQuestion[] }) {
  const { dispatch } = useApp();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.filter(q => answers[q.id] === q.correctIndex).length;

  const handleSubmit = () => {
    setSubmitted(true);
    dispatch({ type: 'RECORD_QUIZ', payload: { topicId, score, total: questions.length } });
    dispatch({ type: 'INCREMENT_DAY' });
  };

  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div key={q.id} className="card">
          <p className="font-medium text-sm mb-3">{qi + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const isSel = answers[q.id] === oi;
              const isCor = oi === q.correctIndex;
              return (
                <button key={oi} onClick={() => !submitted && setAnswers({ ...answers, [q.id]: oi })} disabled={submitted}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm border transition-colors ${
                    submitted && isCor ? 'bg-green-50 border-green-300 text-green-800' :
                    submitted && isSel && !isCor ? 'bg-red-50 border-red-300 text-red-800' :
                    isSel ? 'bg-accent/10 border-accent text-accent-dark' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {opt}{submitted && isCor && ' ✓'}{submitted && isSel && !isCor && ' ✗'}
                </button>
              );
            })}
          </div>
          {submitted && <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>}
        </div>
      ))}
      {!submitted ? (
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < questions.length} className="btn btn-primary w-full">Submit Quiz</button>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Score: {score}/{questions.length}</span>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }} className="btn btn-secondary text-sm">Retry</button>
        </div>
      )}
    </div>
  );
}
