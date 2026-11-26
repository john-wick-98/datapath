import { Link } from 'react-router-dom';
import { useApp, getModuleMastery } from '../store/AppStore';
import { modules } from '../data/modules';

export default function Modules() {
  const { state } = useApp();
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Modules</h1><p className="text-sm text-gray-500">9 modules covering SQL, Excel, Power BI, Python, Stats, Case Studies, Resume, HR, and Technical Interviews</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map(m => {
          const mastery = getModuleMastery(state, m.topics.map(t => t.projectId));
          return (
            <Link key={m.id} to={`/modules/${m.id}`} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{m.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold">{m.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{m.description}</p>
                  <div className="mt-3">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${mastery}%` }} /></div>
                    <div className="flex justify-between mt-1"><span className="text-xs text-gray-400">{m.topics.length} topics</span><span className="text-xs text-gray-400">{mastery}% mastery</span></div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
