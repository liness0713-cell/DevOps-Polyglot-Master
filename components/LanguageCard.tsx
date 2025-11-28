import React from 'react';
import { TrilingualText } from '../types';

interface LanguageCardProps {
  title: TrilingualText;
  content: TrilingualText;
  index: number;
  showRuby: boolean;
}

// Helper to render Markdown-like content safely
// Note: For a full production app, we would use 'react-markdown', but here we do simple processing
// to avoid extra heavy dependencies, handling code blocks and paragraphs.
const SimpleMarkdown: React.FC<{ text: string; isHtml?: boolean }> = ({ text, isHtml }) => {
  
  // Basic parser to split code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose prose-invert max-w-none text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const content = part.replace(/^```[a-z]*\n/, '').replace(/```$/, '');
          return (
            <pre key={i} className="bg-slate-950 p-3 rounded-md overflow-x-auto my-2 border border-slate-700">
              <code className="text-emerald-400 font-mono text-xs">{content}</code>
            </pre>
          );
        }
        
        // Render text lines
        const lines = part.split('\n').filter(l => l.trim() !== '');
        return lines.map((line, j) => {
            // Handle lists roughly
            if (line.trim().startsWith('- ')) {
                 return <div key={`${i}-${j}`} className="ml-4 mb-1 flex"><span className="mr-2">•</span> <span dangerouslySetInnerHTML={isHtml ? {__html: line.replace('- ', '')} : undefined}>{!isHtml ? line.replace('- ', '') : undefined}</span></div>;
            }
            return (
                <p key={`${i}-${j}`} className="mb-2" dangerouslySetInnerHTML={isHtml ? {__html: line} : undefined}>
                    {!isHtml ? line : undefined}
                </p>
            )
        });
      })}
    </div>
  );
};

export const LanguageCard: React.FC<LanguageCardProps> = ({ title, content, index, showRuby }) => {
  return (
    <div className="mb-12 bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shadow-xl backdrop-blur-sm">
      {/* Header */}
      <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-sky-400">{index + 1}. {title.en}</h3>
        </div>
        <div className="flex-1 md:border-l md:border-slate-600 md:pl-4">
          <h3 className="text-lg font-semibold text-emerald-400">{title.zh}</h3>
        </div>
        <div className={`flex-1 md:border-l md:border-slate-600 md:pl-4 ${showRuby ? '' : 'hide-ruby'}`}>
          <h3 className="text-lg font-medium text-rose-400" dangerouslySetInnerHTML={{ __html: title.ja }} />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-slate-700">
        
        {/* English Column */}
        <div className="p-6 bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
            <div className="uppercase tracking-wider text-xs font-bold text-slate-500 mb-3">English</div>
            <SimpleMarkdown text={content.en} />
        </div>

        {/* Chinese Column */}
        <div className="p-6 bg-slate-900/30 hover:bg-slate-900/50 transition-colors">
            <div className="uppercase tracking-wider text-xs font-bold text-slate-500 mb-3">中文 (Chinese)</div>
            <SimpleMarkdown text={content.zh} />
        </div>

        {/* Japanese Column */}
        <div className={`p-6 bg-slate-900/30 hover:bg-slate-900/50 transition-colors ${showRuby ? '' : 'hide-ruby'}`}>
             <div className="uppercase tracking-wider text-xs font-bold text-slate-500 mb-3">日本語 (Japanese)</div>
             {/* Special renderer for Ruby tags */}
             <SimpleMarkdown text={content.ja} isHtml={true} />
        </div>
      </div>
    </div>
  );
};