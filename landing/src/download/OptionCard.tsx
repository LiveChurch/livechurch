import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

/** Option of a single-choice group (radio). */
export function OptionCard({ selected, onSelect, children }: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex flex-1 items-center gap-4 rounded-xl border p-5 text-left transition-colors ${
        selected ? "border-ember bg-ember/10" : "border-edge bg-surface hover:border-ember/50"
      }`}
    >
      {children}
      {selected && <Icon name="check" size={20} className="text-accent" />}
    </button>
  );
}
