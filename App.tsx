import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { LanguageCard } from './components/LanguageCard';
import { generateCourseContent } from './services/geminiService';
import { TopicDef, GeneratedCourse, LoadingState } from './types';

const App: React.FC = () => {
  const [currentTopic, setCurrentTopic] = useState<TopicDef | null>(null);
  const [courseData, setCourseData] = useState<GeneratedCourse | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRuby, setShowRuby] = useState(true);

  const handleSelectTopic = useCallback(async (topic: TopicDef) => {
    if (topic.id === currentTopic?.id) return; // Don't reload if same

    setCurrentTopic(topic);
    setLoadingState('loading');
    setCourseData(null);
    setErrorMsg(null);

    try {
      const data = await generateCourseContent(topic.name);
      setCourseData(data);
      setLoadingState('success');
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate content. Please try again or check your API Key.");
      setLoadingState('error');
    }
  }, [currentTopic]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Sidebar 
        currentTopicId={currentTopic?.id ?? null} 
        onSelectTopic={handleSelectTopic}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-72 min-h-screen flex flex-col">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 lg:hidden bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="font-bold text-sky-400">DevOps Polyglot</div>
            <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-slate-800 text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
        </header>

        <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
          
          {/* Welcome State */}
          {loadingState === 'idle' && !courseData && (
            <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-gradient-to-tr from-sky-500 to-emerald-500 rounded-2xl mb-6 shadow-2xl shadow-sky-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Select a technology to start learning</h2>
              <p className="text-slate-400 max-w-lg">
                Choose a topic from the sidebar (AWS, Docker, K8s, etc.) to generate a comprehensive, tri-lingual guide using AI.
              </p>
              <div className="mt-8 flex gap-4 text-sm text-slate-500 font-mono">
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">English</span>
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">中文</span>
                <span className="px-3 py-1 bg-slate-900 rounded border border-slate-800">日本語 (Ruby)</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loadingState === 'loading' && (
             <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-semibold text-sky-400 animate-pulse">Generating Curriculum for {currentTopic?.name}...</h3>
                <p className="text-slate-500 mt-2 text-sm">Translating concepts, writing code snippets, and adding furigana...</p>
             </div>
          )}

          {/* Error State */}
          {loadingState === 'error' && (
             <div className="h-[50vh] flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-4 text-red-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-red-400 mb-2">Generation Failed</h3>
                <p className="text-slate-400 max-w-md">{errorMsg}</p>
                <button 
                  onClick={() => currentTopic && handleSelectTopic(currentTopic)}
                  className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-white"
                >
                  Try Again
                </button>
             </div>
          )}

          {/* Success State - Content Display */}
          {loadingState === 'success' && courseData && (
            <div className="animate-fade-in pb-20">
              <div className="mb-10 border-b border-slate-800 pb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {courseData.topic}
                  </h1>
                  
                  {/* Toggle Controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-400 font-medium">Ruby (Furigana):</span>
                    <button 
                      onClick={() => setShowRuby(!showRuby)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${showRuby ? 'bg-sky-500' : 'bg-slate-700'}`}
                    >
                      <span className={`${showRuby ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                    </button>
                  </div>
                </div>
                
                {/* Overview Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                             <h4 className="text-xs uppercase font-bold text-sky-500">Overview</h4>
                             <p className="text-sm leading-relaxed text-slate-300">{courseData.overview.en}</p>
                        </div>
                        <div className="space-y-2">
                             <h4 className="text-xs uppercase font-bold text-emerald-500">概述</h4>
                             <p className="text-sm leading-relaxed text-slate-300">{courseData.overview.zh}</p>
                        </div>
                        <div className={`space-y-2 ${showRuby ? '' : 'hide-ruby'}`}>
                             <h4 className="text-xs uppercase font-bold text-rose-500">概要</h4>
                             <p className="text-sm leading-relaxed text-slate-300" dangerouslySetInnerHTML={{__html: courseData.overview.ja}} />
                        </div>
                    </div>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {courseData.sections.map((section, idx) => (
                  <LanguageCard 
                    key={idx} 
                    index={idx}
                    title={section.title} 
                    content={section.content}
                    showRuby={showRuby}
                  />
                ))}
              </div>

              {/* End of content footer */}
              <div className="mt-16 text-center">
                <p className="text-slate-500 italic text-sm">Content generated by AI. Always verify critical commands in a sandbox environment.</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;