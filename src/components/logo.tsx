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
      <rect x="1" y="1" width="38" height="38" rx="12" fill="#0F5B55" />
      <circle cx="20" cy="16" r="7.25" fill="none" stroke="#FBF7F0" strokeWidth="2.1" />
      <path d="M8 27.5h24" stroke="#FBF7F0" strokeWidth="2.1" strokeLinecap="round" />
      <path
        d="M12.5 32h15"
        stroke="#FBF7F0"
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
