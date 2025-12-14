import React from 'react';
import { Copy, Volume2, CheckCheck, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface OutputDisplayProps {
  content: string;
  loading: boolean;
  onSpeak: () => void;
  speaking: boolean;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, loading, onSpeak, speaking }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
          Simplified Output
          {loading && <Loader2 size={14} className="animate-spin text-blue-600" />}
        </label>
        <div className="flex gap-2">
          <button
            onClick={onSpeak}
            disabled={loading || !content || speaking}
            className={`text-xs flex items-center gap-1 font-medium transition-colors px-2 py-1 rounded ${
              speaking 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {speaking ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
            {speaking ? 'Reading...' : 'Read Aloud'}
          </button>
          <button
            onClick={handleCopy}
            disabled={loading || !content}
            className={`text-xs flex items-center gap-1 font-medium transition-colors px-2 py-1 rounded ${
               copied 
               ? 'text-green-600 bg-green-50' 
               : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      
      <div className={`relative flex-grow bg-white rounded-xl border transition-all h-64 sm:h-80 overflow-y-auto ${
        loading ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
      }`}>
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-blue-600 p-8 text-center">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium">Simplifying for clarity...</p>
            <p className="text-sm text-blue-400 mt-2">Making it easier to understand</p>
          </div>
        ) : !content ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <p className="font-medium">Ready to simplify</p>
            <p className="text-sm mt-2">Paste your text on the left and click "Simplify"</p>
          </div>
        ) : (
          <div className="p-6 prose prose-sm sm:prose-base max-w-none text-gray-800">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};