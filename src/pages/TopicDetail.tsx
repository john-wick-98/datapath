import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useApp } from '../store/AppStore';
import { modules } from '../data/modules';
import { projects } from '../data/projects';
import Markdown from '../components/Markdown';
import QuizComponent from '../components/QuizComponent';
import PracticeProject from '../components/PracticeProject';

export default function TopicDetail() {
  const { moduleId, topicId } = useParams();
  const { dispatch } = useApp();
  const module = modules.find(m => m.id === Number(moduleId));
  const topic = module?.topics.find(t => t.id === topicId);

  useEffect(() => {
    if (topic && module) dispatch({ type: 'VISIT_TOPIC', payload: { moduleId: module.id, topicId: topic.id } });
  }, [topic, module, dispatch]);

  if (!topic || !module) return <div className="text-center text-gray-500 py-8">Topic not found</div>;
  const project = projects[topic.projectId];

  return (
    <div className="space-y-6">
      <Link to={`/modules/${module.id}`} className="text-sm text-gray-500 hover:text-accent">← {module.title}</Link>
      <div><h1 className="text-2xl font-bold">{topic.title}</h1><p className="text-sm text-gray-500 mt-1">{module.title}</p></div>
      <div className="card"><h2 className="font-bold text-sm mb-3">📖 Lesson</h2><Markdown content={topic.explanation} /></div>
      {topic.examples.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-sm mb-3">💡 Worked Examples</h2>
          {topic.examples.map((ex, i) => (<div key={i} className="mb-3"><p className="text-sm font-medium">{ex.title}</p><pre className="code-block mt-1 text-xs">{ex.content}</pre></div>))}
        </div>
      )}
      <div className="card bg-blue-50 border-blue-200">
        <p className="text-sm">🔗 <strong>External Resource:</strong> {topic.externalResource.label}<br /><span className="text-xs text-gray-500">{topic.externalResource.url}</span></p>
      </div>
      <div><h2 className="font-bold text-sm mb-3">✅ Quiz</h2><QuizComponent topicId={topic.id} questions={topic.quiz} /></div>
      {project && (<div><h2 className="font-bold text-sm mb-3">🎯 Practice Project: {project.title}</h2><PracticeProject project={project} /></div>)}
    </div>
  );
}
