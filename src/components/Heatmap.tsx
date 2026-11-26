export default function Heatmap({ dates }: { dates: string[] }) {
  const dateSet = new Set(dates);
  const today = new Date();
  const weeks: { date: string; active: boolean }[][] = [];
  const totalDays = 26 * 7;
  const start = new Date(today);
  start.setDate(start.getDate() - totalDays);
  start.setDate(start.getDate() - start.getDay());

  for (let w = 0; w < totalDays / 7; w++) {
    const week: { date: string; active: boolean }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(date.getDate() + w * 7 + d);
      const dateStr = date.toISOString().split('T')[0];
      week.push({ date: dateStr, active: dateSet.has(dateStr) && date <= today });
    }
    weeks.push(week);
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div key={di} className={`w-3 h-3 rounded-sm ${day.active ? 'bg-accent' : 'bg-gray-100'}`} title={day.date} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100" />
        <div className="w-3 h-3 rounded-sm bg-accent/40" />
        <div className="w-3 h-3 rounded-sm bg-accent/70" />
        <div className="w-3 h-3 rounded-sm bg-accent" />
        <span>More</span>
      </div>
    </div>
  );
}
