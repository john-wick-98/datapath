import { useState } from 'react';
import { PracticeProject as Project, CheckpointResult } from '../types';
import { useApp } from '../store/AppStore';
import { executeSql, compareSqlResult, formatDiff } from '../engines/sqlEngine';
import { executePython, comparePythonResult } from '../engines/pythonEngine';
import { setupFormulaParser, evaluateFormula } from '../engines/formulaEngine';
import { gradeWithAI } from '../engines/aiEngine';
import DataTable from './DataTable';

export default function PracticeProject({ project }: { project: Project }) {
  const { state, dispatch } = useApp();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, CheckpointResult>>({});
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setAiFeedback('');
    const newResults: Record<string, CheckpointResult> = {};
    try {
      if (project.checkerType === 'sql') {
        for (const cp of project.checkpoints) {
          const code = inputs[cp.id] || '';
          if (!code.trim()) { newResults[cp.id] = { checkpointId: cp.id, status: 'pending', detail: 'No query written yet.' }; continue; }
          try {
            const actual = await executeSql(project.dataset.content, code, project.dataset.name);
            const match = compareSqlResult(actual, cp.expected);
            newResults[cp.id] = { checkpointId: cp.id, status: match ? 'pass' : 'fail', detail: match ? '' : formatDiff(actual, cp.expected) };
          } catch (e: any) { newResults[cp.id] = { checkpointId: cp.id, status: 'fail', detail: e.message }; }
        }
      } else if (project.checkerType === 'python') {
        for (const cp of project.checkpoints) {
          const code = inputs[cp.id] || '';
          if (!code.trim()) { newResults[cp.id] = { checkpointId: cp.id, status: 'pending', detail: 'No code written yet.' }; continue; }
          try {
            const actual = await executePython(project.dataset.content, code);
            const match = comparePythonResult(actual, cp.expected);
            newResults[cp.id] = { checkpointId: cp.id, status: match ? 'pass' : 'fail', detail: match ? '' : `Expected: ${JSON.stringify(cp.expected)}, Got: ${JSON.stringify(actual)}` };
          } catch (e: any) { newResults[cp.id] = { checkpointId: cp.id, status: 'fail', detail: e.message }; }
        }
      } else if (project.checkerType === 'formula') {
        setupFormulaParser(project.dataset.content);
        for (const cp of project.checkpoints) {
          const code = inputs[cp.id] || '';
          if (!code.trim()) { newResults[cp.id] = { checkpointId: cp.id, status: 'pending', detail: 'No formula entered.' }; continue; }
          try {
            const { result, error } = evaluateFormula(code.startsWith('=') ? code : '=' + code);
            if (error) { newResults[cp.id] = { checkpointId: cp.id, status: 'fail', detail: `Error: ${error}` }; }
            else {
              const match = Math.abs(Number(result) - Number(cp.expected)) < 0.001;
              newResults[cp.id] = { checkpointId: cp.id, status: match ? 'pass' : 'fail', detail: match ? '' : `Expected: ${cp.expected}, Got: ${result}` };
            }
          } catch (e: any) { newResults[cp.id] = { checkpointId: cp.id, status: 'fail', detail: e.message }; }
        }
      } else if (project.checkerType === 'numeric') {
        for (const cp of project.checkpoints) {
          const code = inputs[cp.id] || '';
          if (!code.trim()) { newResults[cp.id] = { checkpointId: cp.id, status: 'pending', detail: 'No answer entered.' }; continue; }
          const val = parseFloat(code);
          const tol = cp.tolerance || 0.01;
          const match = Math.abs(val - cp.expected) <= tol;
          newResults[cp.id] = { checkpointId: cp.id, status: match ? 'pass' : 'fail', detail: match ? '' : `Expected: ~${cp.expected} (±${tol}), Got: ${val}` };
        }
      } else if (project.checkerType === 'ai-review') {
        const submission = Object.values(inputs).join('\n\n---\n\n');
        if (!submission.trim()) {
          for (const cp of project.checkpoints) newResults[cp.id] = { checkpointId: cp.id, status: 'pending', detail: 'No submission yet.' };
        } else {
          try {
            const result = await gradeWithAI(state.aiProvider, state.apiKey, submission, project.aiRubric || 'Evaluate as a data analyst submission.', project.checkpoints.map(c => c.prompt));
            setAiFeedback(result.feedback);
            const score = result.score;
            for (const cp of project.checkpoints) {
              const status: CheckpointResult['status'] = score >= 7 ? 'pass' : score >= 4 ? 'partial' : 'fail';
              newResults[cp.id] = { checkpointId: cp.id, status, detail: '' };
            }
          } catch (e: any) {
            for (const cp of project.checkpoints) newResults[cp.id] = { checkpointId: cp.id, status: 'fail', detail: e.message };
          }
        }
      }
      setResults(newResults);
      const passed = Object.values(newResults).filter(r => r.status === 'pass').length;
      dispatch({ type: 'RECORD_CHECKPOINT', payload: { projectId: project.id, passed, total: project.checkpoints.length } });
      dispatch({ type: 'INCREMENT_DAY' });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const passed = Object.values(results).filter(r => r.status === 'pass').length;
  const total = project.checkpoints.length;
  const placeholder = project.checkerType === 'sql' ? 'Enter SQL query...' : project.checkerType === 'python' ? 'Enter Python code...' : project.checkerType === 'formula' ? 'Enter formula (e.g., =SUM(B2:B5))' : project.checkerType === 'numeric' ? 'Enter numeric answer...' : 'Type your response...';

  return (
    <div className="space-y-4">
      <div className="card bg-accent/5 border-accent/20">
        <h3 className="font-bold text-sm mb-1">📋 Scenario</h3>
        <p className="text-sm text-gray-700">{project.scenario}</p>
      </div>
      <div className="card">
        <h3 className="font-bold text-sm mb-3">📊 Dataset: {project.dataset.name}</h3>
        <DataTable content={project.dataset.content} type={project.dataset.type} />
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-sm">✅ Checkpoints</h3>
        {project.checkpoints.map((cp, i) => (
          <div key={cp.id} className="card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium">{i + 1}. {cp.prompt}</p>
                {cp.hint && <p className="text-xs text-gray-400 mt-1">💡 {cp.hint}</p>}
              </div>
              {results[cp.id] && (
                <span className={`text-lg ${results[cp.id].status === 'pass' ? 'text-green-500' : results[cp.id].status === 'fail' ? 'text-red-500' : 'text-gray-400'}`}>
                  {results[cp.id].status === 'pass' ? '✓' : results[cp.id].status === 'partial' ? '◐' : results[cp.id].status === 'fail' ? '✗' : '○'}
                </span>
              )}
            </div>
            <textarea value={inputs[cp.id] || ''} onChange={e => setInputs({ ...inputs, [cp.id]: e.target.value })}
              placeholder={placeholder} className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-accent" disabled={loading} />
            {results[cp.id]?.detail && <pre className="mt-2 text-xs bg-gray-50 rounded-lg p-2 text-gray-600 overflow-x-auto whitespace-pre-wrap">{results[cp.id].detail}</pre>}
          </div>
        ))}
      </div>
      {aiFeedback && (
        <div className="card bg-amber-50 border-amber-200">
          <h3 className="font-bold text-sm mb-2">🤖 AI Review <span className="text-xs font-normal text-amber-600">(not an exact check)</span></h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{aiFeedback}</pre>
        </div>
      )}
      <div className="flex items-center gap-4">
        <button onClick={handleCheck} disabled={loading} className="btn btn-primary">{loading ? 'Checking...' : 'Run & Check'}</button>
        {Object.keys(results).length > 0 && (
          <>
            <span className="text-sm font-medium">Score: {passed}/{total}</span>
            <button onClick={() => {
              const failed = Object.entries(results).filter(([, r]) => r.status !== 'pass').map(([id]) => id);
              setInputs(prev => { const n = { ...prev }; failed.forEach(id => delete n[id]); return n; });
              setResults({}); setAiFeedback('');
            }} className="btn btn-secondary text-sm">Retry Failed</button>
          </>
        )}
      </div>
      {project.checkerType === 'ai-review' && <p className="text-xs text-amber-600 italic">⚠️ This project is AI-graded, not an exact check. The AI evaluates your submission against a rubric.</p>}
    </div>
  );
}
