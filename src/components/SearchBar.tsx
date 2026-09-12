import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { POPULAR_SEARCH_TERMS } from '../data/mockFood';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  resultCount: number;
  onClear: () => void;
  className?: string;
  autoFocus?: boolean;
}

const STORAGE_KEY = 'aroma_recent_searches';

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  resultCount,
  onClear,
  className = '',
  autoFocus = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      } else {
        setRecentSearches(['Biryani', 'Pizza', 'Momos', 'Cloud kitchen']);
      }
    } catch {
      setRecentSearches(['Biryani', 'Pizza', 'Momos']);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSelectTerm = (term: string) => {
    onChange(term);
    saveRecentSearch(term);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      saveRecentSearch(value.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div
        id="aroma-search-box"
        className={`flex items-center w-full px-3.5 py-2.5 bg-white border rounded-2xl transition-all shadow-xs ${
          isOpen
            ? 'border-orange-500 ring-3 ring-orange-500/15'
            : 'border-stone-200 hover:border-stone-300'
        }`}
      >
        <Search className="w-5 h-5 text-stone-400 shrink-0 mr-2.5 transition-colors" />

        <input
          ref={inputRef}
          id="aroma-search-input"
          type="text"
          value={value}
          autoFocus={autoFocus}
          placeholder="Search for food, dishes, kitchens or offers…"
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none"
        />

        {value ? (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              {resultCount} {resultCount === 1 ? 'dish' : 'dishes'}
            </span>
            <button
              id="clear-search-btn"
              type="button"
              onClick={() => {
                onClear();
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="hidden sm:flex items-center text-[10px] text-stone-400 border border-stone-200 rounded px-1.5 py-0.5 ml-2 font-mono">
            ⌘K
          </span>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div
          id="search-suggestions-dropdown"
          className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden p-4 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Recent Searches */}
          {recentSearches.length > 0 && !value && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="text-xs text-stone-400 hover:text-orange-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    onClick={() => handleSelectTerm(term)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700 hover:text-orange-600 transition-colors"
                  >
                    <Clock className="w-3 h-3 text-stone-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SEARCH_TERMS.map((term, index) => (
                <button
                  key={`popular-${index}`}
                  type="button"
                  onClick={() => handleSelectTerm(term)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-50/60 hover:bg-orange-100 border border-orange-100 text-xs font-medium text-orange-800 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-orange-500" />
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Resale Categories hint */}
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Real-time cloud kitchen inventory
            </span>
            <span className="text-emerald-700 font-semibold">
              Instant 30% - 55% OFF Resale
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
