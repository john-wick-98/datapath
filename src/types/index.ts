export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DiagnosticQuestion extends QuizQuestion {
  moduleId: number;
}

export interface Topic {
  id: string;
  moduleId: number;
  title: string;
  explanation: string;
  examples: { title: string; content: string }[];
  externalResource: { label: string; url: string };
  quiz: QuizQuestion[];
  projectId: string;
}

export interface Module {
  id: number;
  title: string;
  icon: string;
  description: string;
  topics: Topic[];
}

export interface Checkpoint {
  id: string;
  prompt: string;
  hint?: string;
  expected?: any;
  tolerance?: number;
}

export interface PracticeProject {
  id: string;
  title: string;
  scenario: string;
  dataset: { name: string; type: 'csv' | 'json'; content: string };
  checkerType: 'sql' | 'python' | 'formula' | 'numeric' | 'ai-review';
  checkpoints: Checkpoint[];
  aiRubric?: string;
}

export interface CheckpointResult {
  checkpointId: string;
  status: 'pass' | 'fail' | 'pending' | 'partial';
  detail: string;
}

export interface MockTestResult {
  date: string;
  overallScore: number;
  perModuleBreakdown: Record<number, number>;
  duration: number;
}

export interface AppState {
  diagnosticCompleted: boolean;
  diagnosticResults: Record<number, number>;
  moduleStates: Record<number, { manualKnown: boolean; topicsVisited: string[] }>;
  checkpointHistory: Record<string, { passed: number; total: number; attempts: number }>;
  quizHistory: Record<string, { score: number; total: number; date: string }[]>;
  mockTestHistory: MockTestResult[];
  daysActive: number;
  activeDates: string[];
  apiKey: string;
  aiProvider: 'gemini' | 'groq';
  dailyTimeBudget: number;
  lastVisitDate: string;
  mockTestsUnlocked: number;
  chatHistory: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
}

export interface PlacementPrepSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
  type: 'static' | 'ai-review' | 'ai-chat';
  rubric?: string;
}

export interface CompanyQuestion {
  company: string;
  role: string;
  questions: string[];
}
