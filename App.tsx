import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputArea, Attachment } from './components/InputArea';
import { OptionsPanel } from './components/OptionsPanel';
import { OutputDisplay } from './components/OutputDisplay';
import { SimplificationLevel, SimplifyOptions } from './types';
import { simplifyText, speakText } from './services/geminiService';
import { Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [inputContent, setInputContent] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [outputContent, setOutputContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [options, setOptions] = useState<SimplifyOptions>({
    level: SimplificationLevel.HighSchool,
    includeExamples: false,
    highlightDeadlines: true,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSimplify = async () => {
    if (!inputContent.trim() && !attachment) {
        setError("Please enter text or upload a file.");
        setTimeout(() => setError(null), 3000);
        return;
    }

    setLoading(true);
    setError(null);
    setOutputContent('');

    try {
      const result = await simplifyText(inputContent, attachment, options);
      setOutputContent(result);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!outputContent) return;
    setSpeaking(true);
    try {
      await speakText(outputContent);
    } catch (e) {
      console.error("Speech error", e);
      // Optional: show toast
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        
        {/* Intro Banner for Judges */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-200/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Understand any assignment instantly.</h2>
          <p className="text-blue-100 text-lg max-w-2xl">
            Don't let complex academic language hold you back. Paste instructions or upload a screenshot, and get a clear checklist in seconds.
          </p>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Input (Mobile: Top) */}
          <div className="lg:col-span-5 w-full">
            <InputArea 
              value={inputContent} 
              onChange={setInputContent} 
              onClear={() => setInputContent('')}
              attachment={attachment}
              onAttach={setAttachment}
              disabled={loading}
            />
          </div>

          {/* Middle Column: Controls & Actions */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
             <OptionsPanel 
                options={options}
                onChange={setOptions}
                disabled={loading}
             />
             
             <button
              onClick={handleSimplify}
              disabled={loading || (!inputContent.trim() && !attachment)}
              className={`
                group w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200
                flex items-center justify-center gap-3
                ${loading || (!inputContent.trim() && !attachment)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.02] hover:shadow-xl shadow-blue-600/30'
                }
              `}
             >
               {loading ? (
                 "Simplifying..."
               ) : (
                 <>
                   <Sparkles size={20} className={(inputContent.trim() || attachment) ? "group-hover:animate-pulse" : ""} />
                   Simplify
                   <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>

             {error && (
               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                 {error}
               </div>
             )}
          </div>

          {/* Right Column: Output (Mobile: Bottom) */}
          <div className="lg:col-span-4 w-full">
            <OutputDisplay 
              content={outputContent}
              loading={loading}
              onSpeak={handleSpeak}
              speaking={speaking}
            />
          </div>

        </div>

        {/* Info / Examples Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <h4 className="font-semibold text-gray-900 mb-2">For ESL Students</h4>
             <p className="text-sm text-gray-600">Translate complex vocabulary into everyday English to ensure you never miss a requirement.</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <h4 className="font-semibold text-gray-900 mb-2">For Actionable Plans</h4>
             <p className="text-sm text-gray-600">Switch to "Bullet Point Mode" to turn paragraphs of text into a simple to-do list.</p>
           </div>
           <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
             <h4 className="font-semibold text-gray-900 mb-2">Multimodal Input</h4>
             <p className="text-sm text-gray-600">Upload a screenshot of your textbook or a PDF of your syllabus to simplify it instantly.</p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;