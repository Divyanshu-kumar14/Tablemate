export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="Tablemate"
      className={className}
      width="38"
      height="38"
    >
      <defs>
        <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#121217" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <circle cx="20" cy="16" r="7" fill="none" stroke="url(#logo-gold)" strokeWidth="2.2" />
      <path d="M8 27h24" stroke="url(#logo-gold)" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M13 31.5h14"
        stroke="#f4f4f6"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
