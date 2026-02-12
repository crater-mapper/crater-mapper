import { useState, useRef, useEffect, useCallback } from 'react';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SearchBarProps {
  onSelectLocation: (lat: number, lng: number) => void;
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
      );
      const data: SearchResult[] = await res.json();
      setResults(data);
      setOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 400);
  };

  const handleSelect = (result: SearchResult) => {
    onSelectLocation(parseFloat(result.lat), parseFloat(result.lon));
    setQuery(result.display_name.split(',')[0]);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="search-bar" ref={containerRef}>
      {open && results.length > 0 && (
        <ul className="search-results">
          {results.map((r) => (
            <li key={r.place_id} onClick={() => handleSelect(r)}>
              {r.display_name}
            </li>
          ))}
        </ul>
      )}
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search location..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="search-input"
        />
        {loading && <span className="search-spinner" />}
      </div>
    </div>
  );
}
