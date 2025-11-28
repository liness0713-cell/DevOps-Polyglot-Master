import React from 'react';
import { CATEGORIES } from '../constants';
import { TopicDef } from '../types';

interface SidebarProps {
  currentTopicId: string | null;
  onSelectTopic: (topic: TopicDef) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTopicId, onSelectTopic, isOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      />

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo / Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
            <h1 className="text-2xl font-black bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              DevOps<br/>Polyglot
            </h1>
            <p className="text-xs text-slate-400 mt-1">EN / ZH / JA Learning Hub</p>
          </div>

          {/* Navigation List */}
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <h2 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {cat.title}
                </h2>
                <div className="space-y-1">
                  {cat.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        onSelectTopic(topic);
                        onCloseMobile();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 group flex items-center justify-between
                        ${currentTopicId === topic.id 
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    >
                      <span>{topic.name}</span>
                      {currentTopicId === topic.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-slate-800 text-xs text-slate-600 text-center flex flex-col gap-2">
            <div>Powered by Google Gemini</div>
            <div>
              <a 
                href="https://my-portfolio-beige-five-56.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors font-medium"
              >
                千葉２狗 🐶
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};