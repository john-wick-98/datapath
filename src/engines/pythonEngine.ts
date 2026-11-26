declare global {
  interface Window { loadPyodide?: (config?: any) => Promise<any>; }
}

let pyodidePromise: Promise<any> | null = null;

export async function loadPyodide(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    const init = () => {
      window.loadPyodide!({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/' })
        .then(async (py: any) => { await py.loadPackage(['pandas', 'numpy']); resolve(py); })
        .catch(reject);
    };
    if (window.loadPyodide) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
    s.onload = init;
    s.onerror = () => reject(new Error('Failed to load Pyodide engine. Check internet connection.'));
    document.head.appendChild(s);
  });
  return pyodidePromise;
}

export async function executePython(csvContent: string, code: string): Promise<any> {
  const py = await loadPyodide();
  const escaped = csvContent.replace(/'''+/g, "'''");
  await py.runPythonAsync(`import pandas as pd, io\ndf = pd.read_csv(io.StringIO('''${escaped}'''))`);
  try {
    const result = await py.runPythonAsync(code);
    if (result && typeof result === 'object') {
      if (result.toJs) { try { return result.toJs({ dict_converter: Object.fromEntries }); } catch { return String(result); } }
      return String(result);
    }
    return result;
  } catch (e: any) { throw new Error(e.message || 'Python error'); }
}

export function comparePythonResult(actual: any, expected: any): boolean {
  if (typeof actual === 'number' && typeof expected === 'number') return Math.abs(actual - expected) < 0.01;
  try {
    if (typeof actual === 'object' && typeof expected === 'object') return JSON.stringify(actual) === JSON.stringify(expected);
    return String(actual) === String(expected);
  } catch { return String(actual) === String(expected); }
}
