"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  value: number;
  className?: string;
}

export function PriceDisplay({ value, className }: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const motionValue = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest * 100) / 100),
    });
    return controls.stop;
  }, [value, motionValue]);

  return (
    <div className={className}>
      <span className="text-sm text-muted-foreground">a partir de</span>
      <div className="flex items-baseline gap-1">
        <span className="text-xs text-muted-foreground">R$</span>
        <span className="text-2xl font-bold">
          {displayValue.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        <span className="text-sm text-muted-foreground">/mes</span>
      </div>
    </div>
  );
}
