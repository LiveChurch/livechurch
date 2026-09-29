export function CueLabel({ cue, label, className = "" }: { cue?: string; label: string; className?: string }) {
  return (
    <p className={`flex items-center gap-3 text-sm font-semibold ${className}`}>
      {cue && <span className="rounded bg-ember px-1.5 py-0.5 font-mono text-xs text-soot">{cue}</span>}
      <span>{label}</span>
    </p>
  );
}
