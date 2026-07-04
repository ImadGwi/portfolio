// src/components/project/ProjectBackButton.jsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ProjectBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group fixed top-8 left-20 z-50 flex items-center gap-2 rounded-md border bg-transparent px-3 py-2 font-mono text-sm transition-colors cursor-pointer hover:scale-125"
      style={{
        borderColor: '#ffffff',
        color: '#ffffff',
        mixBlendMode: 'difference',
      }}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>Retour</span>
    </button>
  );
}