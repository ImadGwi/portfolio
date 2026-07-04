// src/components/main/TerminalCard.jsx
'use client';

import { useEffect, useState } from 'react';
import CountUp from '@/components/motion/CountUp';

export default function TerminalCard({ stack }) {
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState('typing'); // typing -> counting -> done
  const command = stack.terminalText || '';
  const accent = stack.color || '#22c55e';

  useEffect(() => {
    if (phase !== 'typing') return;
    if (typed.length >= command.length) {
      const t = setTimeout(() => setPhase('counting'), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped(command.slice(0, typed.length + 1)), 35);
    return () => clearTimeout(t);
  }, [typed, phase, command]);

  useEffect(() => {
    if (phase !== 'counting') return;
    const t = setTimeout(() => setPhase('done'), 1200);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div
      className="rounded-lg border bg-[#0d1117] font-mono text-sm shadow-lg overflow-hidden"
      style={{ borderColor: accent }}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: accent }}>
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs" style={{ color: accent }}>
          {/* {stack.icon ? `${stack.icon} ` : ''} */}
          {stack.name}
        </span>
      </div>

      <div className="p-4 min-h-[140px] text-gray-200">
        <p>
          <span style={{ color: accent }}>$</span> <span>{typed}</span>
          {phase === 'typing' && <span className="animate-pulse">▊</span>}
        </p>

        {phase !== 'typing' && (
          <p className="mt-3 flex items-center gap-2">
            <span style={{ color: accent }}>Installing:</span>
            <CountUp from={0} to={100} separator="," direction="up" duration={1} delay={0} className="count-up-text" />
            <span>%</span>
          </p>
        )}

        {phase === 'done' && (
          <>
            <p className="mt-2 text-green-400">done ✓</p>
            <p className="mt-1" style={{ color: accent }}>level: {stack.level || 'n/a'}</p>
          </>
        )}
      </div>
    </div>
  );
}