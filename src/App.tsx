import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import TopicDetail from './pages/TopicDetail';
import PracticeProjects from './pages/PracticeProjects';
import MockTests from './pages/MockTests';
import ProgressPage from './pages/Progress';
import PlacementPrep from './pages/PlacementPrep';
import Mentor from './pages/Mentor';
import Settings from './pages/Settings';
import DiagnosticQuiz from './pages/DiagnosticQuiz';

function AppRoutes() {
  const { state } = useApp();
  return (
    <Routes>
      {!state.diagnosticCompleted ? (
        <Route path="*" element={<DiagnosticQuiz />} />
      ) : (
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:moduleId" element={<ModuleDetail />} />
          <Route path="/modules/:moduleId/:topicId" element={<TopicDetail />} />
          <Route path="/practice" element={<PracticeProjects />} />
          <Route path="/mock-tests" element={<MockTests />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/placement" element={<PlacementPrep />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
