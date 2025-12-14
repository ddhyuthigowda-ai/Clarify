import React, { useRef } from 'react';
import { ClipboardPaste, X, Paperclip, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

interface InputAreaProps {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  attachment: Attachment | null;
  onAttach: (attachment: Attachment | null) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ 
  value, 
  onChange, 
  onClear, 
  attachment,
  onAttach,
  disabled 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple size check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Please use a file under 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      
      onAttach({
        name: file.name,
        mimeType: file.type,
        data: base64Data
      });
      
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Original Text / Source
        </label>
        <div className="flex gap-2">
           {(value || attachment) && (
            <button
              onClick={() => {
                onClear();
                onAttach(null);
              }}
              className="text-xs flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
              disabled={disabled}
            >
              <X size={14} /> Clear All
            </button>
          )}
          <button
            onClick={handlePaste}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={disabled}
          >
            <ClipboardPaste size={14} /> Paste Text
          </button>
        </div>
      </div>
      
      <div className="relative flex-grow flex flex-col gap-3">
        {/* Attachment Preview Area */}
        {attachment && (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                {attachment.mimeType.includes('image') ? <ImageIcon size={20} /> : <FileText size={20} />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-gray-900 truncate block">{attachment.name}</span>
                <span className="text-xs text-gray-500">
                  {attachment.mimeType.includes('pdf') ? 'PDF Document' : 'Image File'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => onAttach(null)}
              className="text-gray-400 hover:text-red-500 p-1 transition-colors"
              disabled={disabled}
              title="Remove file"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        <div className="relative flex-grow">
          <textarea
            className={`w-full h-full p-4 rounded-xl border focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all shadow-sm text-base leading-relaxed bg-white ${
              attachment ? 'border-gray-200 h-48 sm:h-56' : 'border-gray-200 h-64 sm:h-80'
            }`}
            placeholder="Type or paste assignment instructions here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          />
          
          {/* File Upload Trigger inside Textarea (Floating bottom right) */}
          <div className="absolute bottom-3 right-3">
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
               className="hidden" 
               accept="image/*,.pdf,application/pdf"
             />
             <button
               onClick={triggerFileUpload}
               disabled={disabled}
               className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300 shadow-sm"
               title="Attach screenshot or PDF"
             >
               <Paperclip size={16} />
               {attachment ? 'Replace File' : 'Add PDF/Image'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};