import React from 'react';
import { SimplificationLevel, SimplifyOptions } from '../types';
import { Check, Settings2, CalendarClock, MessageSquareQuote } from 'lucide-react';

interface OptionsPanelProps {
  options: SimplifyOptions;
  onChange: (newOptions: SimplifyOptions) => void;
  disabled: boolean;
}

export const OptionsPanel: React.FC<OptionsPanelProps> = ({ options, onChange, disabled }) => {
  const handleChange = (key: keyof SimplifyOptions, value: any) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
        <Settings2 size={18} className="text-gray-500" />
        <h3 className="font-semibold text-gray-800">Configuration</h3>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase">Simplicity Level</label>
        <div className="space-y-2">
          {Object.values(SimplificationLevel).map((level) => (
            <label
              key={level}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                options.level === level
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name="level"
                value={level}
                checked={options.level === level}
                onChange={() => handleChange('level', level)}
                disabled={disabled}
                className="hidden"
              />
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                options.level === level ? 'border-blue-500' : 'border-gray-400'
              }`}>
                {options.level === level && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              <span className="text-sm font-medium">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase">Extras</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              options.includeExamples ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'
            }`}>
              {options.includeExamples && <Check size={14} />}
            </div>
            <input
              type="checkbox"
              checked={options.includeExamples}
              onChange={(e) => handleChange('includeExamples', e.target.checked)}
              disabled={disabled}
              className="hidden"
            />
            <div className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-gray-900">
              <MessageSquareQuote size={16} className="text-purple-500" />
              Explain with examples
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              options.highlightDeadlines ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'
            }`}>
              {options.highlightDeadlines && <Check size={14} />}
            </div>
            <input
              type="checkbox"
              checked={options.highlightDeadlines}
              onChange={(e) => handleChange('highlightDeadlines', e.target.checked)}
              disabled={disabled}
              className="hidden"
            />
             <div className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-gray-900">
              <CalendarClock size={16} className="text-orange-500" />
              Highlight deadlines
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};