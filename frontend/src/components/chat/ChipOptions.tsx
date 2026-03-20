"use client";

import { motion } from "framer-motion";

interface Props {
  chips: string[];
  onSelect: (chip: string) => void;
  disabled?: boolean;
}

export function ChipOptions({ chips, onSelect, disabled }: Props) {
  if (chips.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 px-4 pb-2"
    >
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          disabled={disabled}
          className="px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
        >
          {chip}
        </button>
      ))}
    </motion.div>
  );
}
