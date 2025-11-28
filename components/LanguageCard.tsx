import React from 'react';
import { TrilingualText } from '../types';

interface LanguageCardProps {
  title: TrilingualText;
  content: TrilingualText;
  index: number;
  showRuby: boolean;
}

// Helper to strip HTML tags for TTS (especially <ruby> tags)
// Updated to completely remove <rt> content so "漢字かんじ" becomes "漢字"
const stripHtmlJP = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  
  // Remove phonetic guide tags entirely
  const rts = tmp.querySelectorAll('rt');
  rts.forEach(rt => rt.remove());
  
  return tmp.textContent || tmp.innerText || "";
};

const speak = (text: string, lang: string) => {
  if (!('speechSynthesis' in window)) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // For Japanese, we use the special stripper that removes <rt> content.
  // For others, simple tag stripping is sufficient if markdown/html exists.
  const cleanText = lang === 'ja-JP' ? stripHtmlJP(text) : text.replace(/<[^>]*>?/gm, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for better clarity
  window.speechSynthesis.speak(utterance);
};

const SpeakerButton: React.FC<{ text: string; lang: string; colorClass: string }> = ({ text, lang, colorClass }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      speak(text, lang);
    }}
    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${colorClass}`}
    title="Read aloud"
    aria-label="Read aloud"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
);

// Helper to render Markdown-like content safely
const SimpleMarkdown: React.FC<{ text: string; isHtml?: boolean }> = ({ text, isHtml }) => {
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose prose-invert max-w-none text-base leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const content = part.replace(/^```[a-z]*\n/, '').replace(/```$/, '');
          return (
            <pre key={i} className="bg-slate-950 p-4 rounded-lg overflow-x-auto my-4 border border-slate-700 shadow-inner">
              <code className="text-emerald-400 font-mono text-sm">{content}</code>
            </pre>
          );
        }
        
        const lines = part.split('\n').filter(l => l.trim() !== '');
        return lines.map((line, j) => {
            if (line.trim().startsWith('- ')) {
                 return <div key={`${i}-${j}`} className="ml-4 mb-2 flex"><span className="mr-2 text-slate-500">•</span> <span dangerouslySetInnerHTML={isHtml ? {__html: line.replace('- ', '')} : undefined}>{!isHtml ? line.replace('- ', '') : undefined}</span></div>;
            }
            return (
                <p key={`${i}-${j}`} className="mb-4 text-slate-300" dangerouslySetInnerHTML={isHtml ? {__html: line} : undefined}>
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
    <div id={`section-${index}`} className="mb-16 bg-slate-800/40 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl backdrop-blur-sm scroll-mt-28">
      
      {/* English Section */}
      <div className="border-b border-slate-700/50">
        <div className="bg-slate-900/40 p-4 px-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">EN</span>
             <h3 className="text-xl font-bold text-sky-400">{index + 1}. {title.en}</h3>
          </div>
          <SpeakerButton text={`${title.en}. ${content.en}`} lang="en-US" colorClass="text-sky-400" />
        </div>
        <div className="p-6 md:p-8 bg-slate-900/20">
          <SimpleMarkdown text={content.en} />
        </div>
      </div>

      {/* Chinese Section */}
      <div className="border-b border-slate-700/50">
        <div className="bg-slate-900/40 p-4 px-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ZH</span>
             <h3 className="text-xl font-bold text-emerald-400">{title.zh}</h3>
          </div>
          <SpeakerButton text={`${title.zh}. ${content.zh}`} lang="zh-CN" colorClass="text-emerald-400" />
        </div>
        <div className="p-6 md:p-8 bg-slate-900/20">
          <SimpleMarkdown text={content.zh} />
        </div>
      </div>

      {/* Japanese Section */}
      <div className={`${showRuby ? '' : 'hide-ruby'}`}>
        <div className="bg-slate-900/40 p-4 px-6 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">JA</span>
             <h3 className="text-xl font-bold text-rose-400" dangerouslySetInnerHTML={{ __html: title.ja }} />
          </div>
          <SpeakerButton text={`${stripHtmlJP(title.ja)}. ${stripHtmlJP(content.ja)}`} lang="ja-JP" colorClass="text-rose-400" />
        </div>
        <div className="p-6 md:p-8 bg-slate-900/20">
             {/* Extra leading for Japanese to accommodate Ruby tags */}
             <div className="text-lg leading-loose">
               <SimpleMarkdown text={content.ja} isHtml={true} />
             </div>
        </div>
      </div>

    </div>
  );
};