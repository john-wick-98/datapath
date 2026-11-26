declare global {
  interface Window { initSqlJs?: (config?: any) => Promise<any>; }
}

let sqlPromise: Promise<any> | null = null;
let sqlDb: any = null;
let currentDataset: string | null = null;

async function loadSqlJs(): Promise<any> {
  if (sqlPromise) return sqlPromise;
  sqlPromise = new Promise((resolve, reject) => {
    const init = () => {
      window.initSqlJs!({ locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/${f}` })
        .then(resolve).catch(reject);
    };
    if (window.initSqlJs) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.11.0/sql-wasm.js';
    s.onload = init;
    s.onerror = () => reject(new Error('Failed to load sql.js engine. Check internet connection.'));
    document.head.appendChild(s);
  });
  return sqlPromise;
}

function csvToSql(csv: string, table: string, db: any) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map((h: string) => h.trim().replace(/"/g, ''));
  db.run(`CREATE TABLE ${table} (${headers.map((h: string) => `"${h}" TEXT`).join(', ')});`);
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map((v: string) => v.trim().replace(/"/g, '').replace(/'/g, "''"));
    db.run(`INSERT INTO ${table} VALUES (${vals.map((v: string) => `'${v}'`).join(', ')});`);
  }
}

export async function getSqlDb(datasetContent: string): Promise<any> {
  if (sqlDb && currentDataset === datasetContent) return sqlDb;
  const SQL = await loadSqlJs();
  sqlDb = new SQL.Database();
  currentDataset = datasetContent;
  try {
    const parsed = JSON.parse(datasetContent);
    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      for (const [name, csv] of Object.entries(parsed)) csvToSql(csv as string, name, sqlDb);
      return sqlDb;
    }
  } catch { /* single CSV */ }
  csvToSql(datasetContent, 'data', sqlDb);
  return sqlDb;
}

export async function executeSql(datasetContent: string, query: string) {
  const db = await getSqlDb(datasetContent);
  try {
    const r = db.exec(query);
    if (!r.length) return { columns: [] as string[], values: [] as any[][] };
    return { columns: r[0].columns as string[], values: r[0].values as any[][] };
  } catch (e: any) { throw new Error(e.message || 'SQL error'); }
}

export function compareSqlResult(actual: { columns: string[]; values: any[][] }, expected: { columns: string[]; values: any[][] }): boolean {
  if (actual.values.length !== expected.values.length) return false;
  const a = actual.values.map(r => r.map(String).join('|')).sort().join('\n');
  const e = expected.values.map(r => r.map(String).join('|')).sort().join('\n');
  return a === e;
}

export function formatDiff(actual: { columns: string[]; values: any[][] }, expected: { columns: string[]; values: any[][] }): string {
  return `Expected ${expected.values.length} rows, got ${actual.values.length}.\n\nExpected columns: ${expected.columns.join(', ')}\nYour columns: ${actual.columns.join(', ')}\n\nExpected (first 5):\n${expected.values.slice(0, 5).map(r => r.join(' | ')).join('\n')}\n\nGot (first 5):\n${actual.values.slice(0, 5).map(r => r.join(' | ')).join('\n')}`;
}
