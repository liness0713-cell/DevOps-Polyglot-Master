import React, { useState } from 'react';
import { Section } from '../types';

export const TableOfContents: React.FC<{ sections: Section[] }> = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(true);

  const scrollToSection = (index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) {
       // Offset for header
       const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
       window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <>
      {/* Floating Trigger Button (Visible when closed) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 bottom-6 lg:top-24 lg:bottom-auto z-40 bg-sky-500 text-white p-3 rounded-full shadow-lg hover:bg-sky-400 transition-all duration-300 transform ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
        aria-label="Open Table of Contents"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Sidebar Panel (Visible when open) */}
      <div className={`fixed right-6 bottom-6 lg:top-24 lg:bottom-auto z-40 w-64 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right lg:origin-top-right transform ${isOpen ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-8 pointer-events-none'}`}>
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
             <span className="font-bold text-slate-200 text-sm uppercase tracking-wider">Contents</span>
             <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
             </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-600">
             <ul className="space-y-1">
                {sections.map((s, i) => (
                    <li key={i}>
                        <button 
                            onClick={() => scrollToSection(i)}
                            className="w-full text-left px-3 py-2 rounded text-sm text-slate-300 hover:bg-sky-500/20 hover:text-sky-400 transition-colors truncate flex items-center gap-2"
                        >
                            <span className="text-xs font-mono text-slate-500 opacity-50">{i + 1}</span>
                            <span className="truncate">{s.title.en}</span>
                        </button>
                    </li>
                ))}
             </ul>
          </div>
      </div>
    </>
  );
}