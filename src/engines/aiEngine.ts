const MENTOR_SYSTEM_PROMPT = `You are a direct, encouraging career coach for Indian data analytics job seekers. Use the STAR method when reviewing behavioral answers. Reference Indian hiring norms (campus/off-campus drives, HR vs managerial vs case-study rounds, ATS resume screening, CTC structures) when relevant. Be candid about gaps — don't inflate weak answers. Keep responses under 150 words unless asked to go deeper. You will receive the user's current module, their checkpoint pass-rate history, and their weak-topic list as context — use it, don't ask them to repeat it.`;

export function getMentorContext(state: any, weakTopics: any[]): string {
  const modInfo = state.diagnosticResults
    ? Object.entries(state.diagnosticResults).map(([id, s]) => `Module ${id}: ${s}%`).join(', ')
    : 'No diagnostic data';
  const weakInfo = weakTopics.length > 0
    ? weakTopics.map((t: any) => `${t.title} (${Math.round(t.passRate * 100)}%)`).join(', ')
    : 'No weak topics';
  return `\n\n[Context: Module progress: ${modInfo}. Weak topics: ${weakInfo}. Days active: ${state.daysActive}. Mock tests: ${state.mockTestHistory.length}.]`;
}

export async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 500, temperature: 0.7 } }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `Gemini error: ${res.status}`); }
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
}

export async function callGroq(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'system', content: MENTOR_SYSTEM_PROMPT }, { role: 'user', content: prompt }], max_tokens: 500, temperature: 0.7 }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `Groq error: ${res.status}`); }
  const d = await res.json();
  return d.choices?.[0]?.message?.content || 'No response received.';
}

export async function callAI(provider: 'gemini' | 'groq', apiKey: string, prompt: string): Promise<string> {
  if (!apiKey) throw new Error('No API key set. Add your key in Settings → API Key.');
  return provider === 'gemini' ? callGemini(apiKey, prompt) : callGroq(apiKey, prompt);
}

export async function gradeWithAI(provider: 'gemini' | 'groq', apiKey: string, submission: string, rubric: string, checkpointPrompts: string[]) {
  const prompt = `You are grading an analyst's submission. Be strict but fair.\n\nRUBRIC:\n${rubric}\n\nCHECKPOINTS:\n${checkpointPrompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nSUBMISSION:\n${submission}\n\nRespond in EXACTLY this format:\nSCORE: X/10\nSTRENGTHS: (1-2 sentences)\nMISSING: (1-2 sentences)\nFIX: (one concrete actionable fix)`;
  const response = await callAI(provider, apiKey, prompt);
  const m = response.match(/SCORE:\s*(\d+)/i);
  return { score: m ? parseInt(m[1]) : 0, feedback: response };
}

export { MENTOR_SYSTEM_PROMPT };
