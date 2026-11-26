import { Parser } from 'hot-formula-parser';

let parserInstance: Parser | null = null;

export function setupFormulaParser(csvContent: string): void {
  const grid: Record<string, any> = {};
  const lines = csvContent.trim().split('\n');
  for (let r = 0; r < lines.length; r++) {
    const cells = lines[r].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    for (let c = 0; c < cells.length; c++) {
      const key = `${String.fromCharCode(65 + c)}${r + 1}`;
      const val = cells[c];
      const num = Number(val);
      grid[key] = !isNaN(num) && val !== '' ? num : val;
    }
  }
  parserInstance = new Parser();
  parserInstance.on('callCellValue', (cc: any) => grid[`${cc.column.label}${cc.row.index + 1}`]);
  parserInstance.on('callRangeValue', (start: any, end: any) => {
    const vals: any[] = [];
    for (let row = start.row.index + 1; row <= end.row.index + 1; row++)
      for (let col = start.column.index; col <= end.column.index; col++)
        vals.push(grid[`${String.fromCharCode(65 + col)}${row}`]);
    return vals;
  });
}

export function evaluateFormula(formula: string): { result: any; error: string | null } {
  if (!parserInstance) return { result: null, error: 'Parser not initialized' };
  const expr = formula.startsWith('=') ? formula.slice(1) : formula;
  const r = parserInstance.parse(expr);
  return r.error ? { result: null, error: r.error } : { result: r.result, error: null };
}
