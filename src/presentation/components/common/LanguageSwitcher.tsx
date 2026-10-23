import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../context/I18nContext';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { SupportedLanguage } from '../../../infrastructure/i18n/types';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { language, setLanguage, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = languages.find(opt => opt.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button - Shows only the active language */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Idioma actual: ${currentOption.label}. Abrir selector desplegable de idiomas`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#111111] hover:bg-stone-800 text-stone-200 hover:text-white border-2 border-black shadow-[2px_2px_0px_#000] transition text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#fa9427]"
      >
        <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
        <span className="text-sm leading-none" role="img" aria-label={currentOption.label}>
          {currentOption.flag}
        </span>
        <span className="uppercase text-[11px] font-black tracking-wider text-amber-200">
          {compact ? currentOption.code : currentOption.nativeLabel}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Seleccionar idioma"
          className="absolute right-0 mt-1.5 w-44 bg-[#111111] border-3 border-black shadow-[4px_4px_0px_#000] z-50 py-1 overflow-hidden backdrop-blur-md"
        >
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-400 border-b border-stone-800">
            Idioma / Language / 言語
          </div>
          {languages.map(opt => {
            const isActive = language === opt.code;
            return (
              <button
                key={opt.code}
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelectLanguage(opt.code as SupportedLanguage)}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-amber-600/25 text-amber-300 font-black border-l-2 border-amber-500'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none" role="img" aria-hidden="true">
                    {opt.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold">{opt.nativeLabel}</span>
                    <span className="text-[10px] text-stone-400 uppercase font-mono">{opt.code} • {opt.label}</span>
                  </div>
                </div>
                {isActive && (
                  <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
