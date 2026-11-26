import { useParams, Link } from 'react-router-dom';
import { useApp, getModuleMastery } from '../store/AppStore';
import { modules } from '../data/modules';
import { projects } from '../data/projects';

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const { state, dispatch } = useApp();
  const module = modules.find(m => m.id === Number(moduleId));
  if (!module) return <div className="text-center text-gray-500 py-8">Module not found</div>;
  const mastery = getModuleMastery(state, module.topics.map(t => t.projectId));
  const moduleState = state.moduleStates[module.id];

  return (
    <div className="space-y-6">
      <Link to="/modules" className="text-sm text-gray-500 hover:text-accent">← All Modules</Link>
      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{module.icon}</span>
          <div><h1 className="text-2xl font-bold">{module.title}</h1><p className="text-sm text-gray-500">{module.description}</p></div>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex-1"><div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${mastery}%` }} /></div></div>
          <span className="text-sm font-medium">{mastery}%</span>
          <button onClick={() => dispatch({ type: 'TOGGLE_MANUAL_KNOWN', payload: { moduleId: module.id } })}
            className={`text-xs px-3 py-1 rounded-full ${moduleState?.manualKnown ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {moduleState?.manualKnown ? '✓ Known' : 'Mark as Known'}
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {module.topics.map((topic, i) => {
          const project = projects[topic.projectId];
          const cp = state.checkpointHistory[topic.projectId];
          const tm = cp && cp.total > 0 ? Math.round((cp.passed / cp.total) * 100) : 0;
          const visited = moduleState?.topicsVisited.includes(topic.id);
          return (
            <Link key={topic.id} to={`/modules/${module.id}/${topic.id}`} className="card hover:shadow-md transition-shadow block">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${visited ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</span>
                  <div><h3 className="font-medium text-sm">{topic.title}</h3><p className="text-xs text-gray-400 mt-0.5">{project?.checkerType} project • {topic.quiz.length} quiz questions</p></div>
                </div>
                <div className="text-right">{tm > 0 && <span className="text-xs font-medium text-accent">{tm}%</span>}{visited && <span className="text-xs text-gray-400 ml-2">✓ visited</span>}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
