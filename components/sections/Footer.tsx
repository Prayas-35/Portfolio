"use client";

import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer aria-label="Site footer" className="mt-20 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {year}</span>
            <span className="select-none">•</span>
            <span className="inline-flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500" fill="currentColor" aria-hidden="true" />
              by
              <span className="font-medium text-white">Prayas</span>
            </span>
          </p>

          <div className="text-xs text-muted-foreground/80">
            <span className="rounded-full border border-white/10 bg-linear-to-r from-white/5 to-white/5 px-3 py-1">
              Built with Next.js
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
