import React from 'react';

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/`([^`]+)`/);
  return parts.map((part, i) => {
    if (i % 2 === 1) return <code key={i} className="bg-gray-100 text-accent-dark px-1 py-0.5 rounded text-sm font-mono">{part}</code>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function Markdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeContent = '';
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length) {
      elements.push(<ul key={key} className="list-disc list-inside text-sm text-gray-700 mb-2 space-y-1">{listItems.map((li, j) => <li key={j}>{renderInline(li)}</li>)}</ul>);
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) { elements.push(<pre key={i} className="code-block">{codeContent.trim()}</pre>); codeContent = ''; inCode = false; }
      else { flushList(`fl-${i}`); inCode = true; }
      return;
    }
    if (inCode) { codeContent += line + '\n'; return; }
    if (line.startsWith('## ')) { flushList(`fl-${i}`); elements.push(<h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.slice(3)}</h2>); }
    else if (line.startsWith('### ')) { flushList(`fl-${i}`); elements.push(<h3 key={i} className="text-base font-semibold mt-3 mb-1">{line.slice(4)}</h3>); }
    else if (line.startsWith('- ')) { listItems.push(line.slice(2)); }
    else if (line.trim() === '') { flushList(`fl-${i}`); }
    else { flushList(`fl-${i}`); elements.push(<p key={i} className="text-sm text-gray-700 mb-2 leading-relaxed">{renderInline(line)}</p>); }
  });
  flushList('fl-final');
  if (inCode) elements.push(<pre key="code-final" className="code-block">{codeContent.trim()}</pre>);

  return <div>{elements}</div>;
}
