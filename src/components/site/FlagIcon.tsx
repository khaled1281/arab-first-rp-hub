type Props = { className?: string };

export function FlagSA({ className = "h-3.5 w-5" }: Props) {
  return (
    <svg viewBox="0 0 24 16" className={`shrink-0 rounded-[3px] ${className}`} aria-hidden="true">
      <rect width="24" height="16" fill="#0f7b3d" />
      <rect x="3" y="5.2" width="18" height="1.5" rx="0.7" fill="#fff" />
      <rect x="3" y="8" width="14" height="1.1" rx="0.55" fill="#fff" />
      <rect x="3" y="10.4" width="18" height="1.1" rx="0.55" fill="#fff" />
    </svg>
  );
}

export function FlagGB({ className = "h-3.5 w-5" }: Props) {
  return (
    <svg viewBox="0 0 24 16" className={`shrink-0 rounded-[3px] ${className}`} aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}
