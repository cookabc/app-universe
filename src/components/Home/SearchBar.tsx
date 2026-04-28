interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-field">
      <label htmlFor="skill-search" className="sr-only">
        Search Skills
      </label>
      <svg
        className="search-field-icon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        id="skill-search"
        type="search"
        name="q"
        placeholder="Search by name, category, or workflow…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        className="search-field-input"
      />
      {value && (
        <button
          type="button"
          className="search-clear-button"
          aria-label="Clear Search"
          onClick={() => onChange("")}
        >
          ×
        </button>
      )}
    </div>
  );
}
