export default function DataTable({ content, type }: { content: string; type: 'csv' | 'json' }) {
  let headers: string[] = [];
  let rows: string[][] = [];

  if (type === 'csv') {
    const lines = content.trim().split('\n');
    headers = lines[0].split(',').map(h => h.trim());
    rows = lines.slice(1).map(line => line.split(',').map(c => c.trim()));
  } else {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        headers = Object.keys(data[0]);
        rows = data.map((item: any) => headers.map(h => String(item[h] ?? '')));
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        return (
          <div className="space-y-4">
            {Object.entries(data).map(([tableName, csv]) => (
              <div key={tableName}>
                <h4 className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Table: {tableName}</h4>
                <DataTable content={csv as string} type="csv" />
              </div>
            ))}
          </div>
        );
      }
    } catch {
      headers = ['Error'];
      rows = [['Invalid JSON']];
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {headers.map((h, i) => <th key={i} className="text-left px-3 py-2 font-medium text-gray-600 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-gray-50">
              {row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-gray-700 whitespace-nowrap">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
