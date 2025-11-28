import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { LanguageCard } from './components/LanguageCard';
import { TableOfContents } from './components/TableOfContents';
import { generateCourseContent } from './services/geminiService';
import { TopicDef, GeneratedCourse, LoadingState } from './types';

// Helper to strip HTML tags for TTS, specifically removing <rt> tags for Japanese
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
  window.speechSynthesis.cancel();
  
  // Clean text based on language
  const cleanText = lang === 'ja-JP' ? stripHtmlJP(text) : text.replace(/<[^>]*>?/gm, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};

const SpeakerButton: React.FC<{ text: string; lang: string; colorClass: string }> = ({ text, lang, colorClass }) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      speak(text, lang);
    }}
    className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${colorClass}`}
    title="Read aloud"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
);

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

        <main className="flex-1 p-4 lg:p-10 max-w-5xl mx-auto w-full relative">
          
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
              
              {/* Floating Table of Contents */}
              <TableOfContents sections={courseData.sections} />

              <div className="mb-12 border-b border-slate-800 pb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {courseData.topic}
                  </h1>
                  
                  {/* Toggle Controls */}
                  <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    <span className="text-sm text-slate-400 font-medium pl-2">Ruby (Furigana):</span>
                    <button 
                      onClick={() => setShowRuby(!showRuby)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${showRuby ? 'bg-sky-500' : 'bg-slate-700'}`}
                    >
                      <span className={`${showRuby ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                    </button>
                  </div>
                </div>
                
                {/* Overview Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                    <div className="bg-slate-950/30 px-6 py-3 border-b border-slate-800 flex items-center gap-2">
                       <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span className="uppercase tracking-widest text-xs font-bold text-slate-400">Course Overview</span>
                    </div>
                    
                    <div className="flex flex-col divide-y divide-slate-800">
                        {/* EN */}
                        <div className="p-6 hover:bg-white/5 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs uppercase font-bold text-sky-500">English</h4>
                                <SpeakerButton text={courseData.overview.en} lang="en-US" colorClass="text-sky-500" />
                            </div>
                            <p className="text-base leading-relaxed text-slate-300">{courseData.overview.en}</p>
                        </div>
                        
                        {/* ZH */}
                        <div className="p-6 hover:bg-white/5 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs uppercase font-bold text-emerald-500">中文</h4>
                                <SpeakerButton text={courseData.overview.zh} lang="zh-CN" colorClass="text-emerald-500" />
                            </div>
                            <p className="text-base leading-relaxed text-slate-300">{courseData.overview.zh}</p>
                        </div>
                        
                        {/* JA */}
                        <div className={`p-6 hover:bg-white/5 transition-colors ${showRuby ? '' : 'hide-ruby'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs uppercase font-bold text-rose-500">日本語</h4>
                                <SpeakerButton text={stripHtmlJP(courseData.overview.ja)} lang="ja-JP" colorClass="text-rose-500" />
                            </div>
                            <div className="text-lg leading-loose text-slate-300">
                                <span dangerouslySetInnerHTML={{__html: courseData.overview.ja}} />
                            </div>
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