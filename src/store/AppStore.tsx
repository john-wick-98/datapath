import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, MockTestResult } from '../types';

const STORAGE_KEY = 'datapath_state_v1';

const initialState: AppState = {
  diagnosticCompleted: false,
  diagnosticResults: {},
  moduleStates: {},
  checkpointHistory: {},
  quizHistory: {},
  mockTestHistory: [],
  daysActive: 0,
  activeDates: [],
  apiKey: '',
  aiProvider: 'gemini',
  dailyTimeBudget: 120,
  lastVisitDate: '',
  mockTestsUnlocked: 0,
  chatHistory: [],
};

type Action =
  | { type: 'SET_DIAGNOSTIC'; payload: { results: Record<number, number> } }
  | { type: 'TOGGLE_MANUAL_KNOWN'; payload: { moduleId: number } }
  | { type: 'VISIT_TOPIC'; payload: { moduleId: number; topicId: string } }
  | { type: 'RECORD_CHECKPOINT'; payload: { projectId: string; passed: number; total: number } }
  | { type: 'RECORD_QUIZ'; payload: { topicId: string; score: number; total: number } }
  | { type: 'RECORD_MOCK_TEST'; payload: { result: MockTestResult } }
  | { type: 'INCREMENT_DAY' }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_AI_PROVIDER'; payload: 'gemini' | 'groq' }
  | { type: 'SET_TIME_BUDGET'; payload: number }
  | { type: 'ADD_CHAT_MESSAGE'; payload: { role: 'user' | 'assistant'; content: string } }
  | { type: 'CLEAR_CHAT' }
  | { type: 'IMPORT_STATE'; payload: AppState }
  | { type: 'RESET_STATE' };

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initialState, ...JSON.parse(saved) };
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return initialState;
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DIAGNOSTIC':
      return {
        ...state,
        diagnosticCompleted: true,
        diagnosticResults: action.payload.results,
        moduleStates: Object.fromEntries(
          Object.entries(action.payload.results).map(([id, score]) => [
            Number(id), { manualKnown: (score as number) >= 70, topicsVisited: [] },
          ])
        ),
      };
    case 'TOGGLE_MANUAL_KNOWN': {
      const cur = state.moduleStates[action.payload.moduleId] || { manualKnown: false, topicsVisited: [] };
      return {
        ...state,
        moduleStates: { ...state.moduleStates, [action.payload.moduleId]: { ...cur, manualKnown: !cur.manualKnown } },
      };
    }
    case 'VISIT_TOPIC': {
      const cur = state.moduleStates[action.payload.moduleId] || { manualKnown: false, topicsVisited: [] };
      if (cur.topicsVisited.includes(action.payload.topicId)) return state;
      return {
        ...state,
        moduleStates: { ...state.moduleStates, [action.payload.moduleId]: { ...cur, topicsVisited: [...cur.topicsVisited, action.payload.topicId] } },
      };
    }
    case 'RECORD_CHECKPOINT': {
      const ex = state.checkpointHistory[action.payload.projectId] || { passed: 0, total: 0, attempts: 0 };
      const newPR = action.payload.passed / action.payload.total;
      const oldPR = ex.total > 0 ? ex.passed / ex.total : 0;
      return {
        ...state,
        checkpointHistory: {
          ...state.checkpointHistory,
          [action.payload.projectId]: {
            passed: newPR >= oldPR ? action.payload.passed : ex.passed,
            total: newPR >= oldPR ? action.payload.total : ex.total,
            attempts: ex.attempts + 1,
          },
        },
      };
    }
    case 'RECORD_QUIZ': {
      const ex = state.quizHistory[action.payload.topicId] || [];
      return {
        ...state,
        quizHistory: { ...state.quizHistory, [action.payload.topicId]: [...ex, { score: action.payload.score, total: action.payload.total, date: getToday() }] },
      };
    }
    case 'RECORD_MOCK_TEST':
      return { ...state, mockTestHistory: [...state.mockTestHistory, action.payload.result] };
    case 'INCREMENT_DAY': {
      const today = getToday();
      if (state.lastVisitDate === today) return state;
      const newDays = state.daysActive + 1;
      return { ...state, daysActive: newDays, activeDates: [...state.activeDates, today], lastVisitDate: today, mockTestsUnlocked: Math.floor(newDays / 10) };
    }
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_AI_PROVIDER':
      return { ...state, aiProvider: action.payload };
    case 'SET_TIME_BUDGET':
      return { ...state, dailyTimeBudget: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, { ...action.payload, timestamp: new Date().toISOString() }] };
    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [] };
    case 'IMPORT_STATE':
      return { ...initialState, ...action.payload };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

interface AppContextType { state: AppState; dispatch: React.Dispatch<Action>; }
const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  useEffect(() => { saveState(state); }, [state]);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function getModuleMastery(state: AppState, projectIds: string[]): number {
  if (!projectIds.length) return 0;
  const scores = projectIds.map(pid => {
    const h = state.checkpointHistory[pid];
    return h && h.total > 0 ? h.passed / h.total : 0;
  });
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
}

export function getWeakTopics(state: AppState, topics: { id: string; title: string; moduleId: number; projectId: string }[]) {
  return topics
    .map(t => {
      const h = state.checkpointHistory[t.projectId];
      const passRate = h && h.total > 0 ? h.passed / h.total : -1;
      return { topicId: t.id, title: t.title, moduleId: t.moduleId, passRate };
    })
    .filter(t => t.passRate >= 0 && t.passRate < 0.6)
    .sort((a, b) => a.passRate - b.passRate);
}

export function getStreak(state: AppState): number {
  if (!state.activeDates.length) return 0;
  const dates = [...state.activeDates].sort();
  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const diff = (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000;
    if (diff === 1) streak++; else break;
  }
  return streak;
}
