"use client";

import { Shield } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <span className="font-semibold text-lg">
        Seguro<span className="text-blue-600">Simples</span>
      </span>
    </Link>
  );
}
