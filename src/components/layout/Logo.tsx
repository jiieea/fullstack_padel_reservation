export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="none" stroke="#C9A96A" strokeWidth="3" />
      <g transform="rotate(35 60 60)">
        <path d="M60 18c15 0 24 10 24 24 0 11-6 20-14 26h-20c-8-6-14-15-14-26 0-14 9-24 24-24z" fill="none" stroke="#C9A96A" strokeWidth="4" />
        <rect x="55.5" y="68" width="9" height="26" rx="3" fill="#C9A96A" />
      </g>
      <circle cx="87" cy="87" r="10" fill="#D9E36B" />
    </svg>
  );
}
