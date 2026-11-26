import { useState } from 'react';
import { Link } from 'react-router-dom';
import { modules } from '../data/modules';
import { projects } from '../data/projects';
import { useApp } from '../store/AppStore';
import { Topic, Module, PracticeProject } from '../types';

type ProjectEntry = { topic: Topic; module: Module; project: PracticeProject };

export default function PracticeProjects() {
  const { state } = useApp();
  const [filter, setFilter] = useState('all');
  const checkerTypes = ['all', 'sql', 'python', 'formula', 'numeric', 'ai-review'];

  const allProjects: ProjectEntry[] = modules.flatMap(m =>
    m.topics.flatMap(t => {
      const project = projects[t.projectId];
      return project ? [{ topic: t, module: m, project }] : [];
    })
  );

  const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.project.checkerType === filter);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Practice Projects</h1><p className="text-sm text-gray-500">Browse and filter all practice projects across modules</p></div>
      <div className="flex flex-wrap gap-2">
        {checkerTypes.map(type => (
          <button key={type} onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === type ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{type === 'all' ? 'All' : type}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(({ topic, module: mod, project }) => {
          const cp = state.checkpointHistory[project.id];
          const mastery = cp && cp.total > 0 ? Math.round((cp.passed / cp.total) * 100) : 0;
          return (
            <Link key={project.id} to={`/modules/${mod.id}/${topic.id}`} className="card hover:shadow-md transition-shadow block">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{project.checkerType}</span><span className="text-xs text-gray-400">{mod.icon} {mod.title}</span></div>
                  <h3 className="font-medium text-sm">{project.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{project.scenario.slice(0, 80)}...</p>
                </div>
                <div className="text-right ml-4">{mastery > 0 && <span className="text-xs font-medium text-accent">{mastery}%</span>}<p className="text-xs text-gray-400">{project.checkpoints.length} checkpoints</p></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
