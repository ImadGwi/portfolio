// src/components/main/PillNav.jsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function PillNav({
  items,
  activeHref,
  accentColor = '#1326EE',
  activeTextColor = '#ffffff',
  textColor = '#1e2a5e',
  className = '',
}) {
  const pillRefs = useRef([]);

  useEffect(() => {
    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4, delay: i * 0.06, ease: 'power2.out' }
      );
    });
  }, []);

  const handleEnter = (el) => {
    gsap.to(el, { scale: 1.06, duration: 0.2, ease: 'power2.out' });
  };

  const handleLeave = (el) => {
    gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out' });
  };

  return (
    <div className="w-full max-w-full overflow-x-auto px-4 no-scrollbar">
      <nav
        className={`inline-flex items-center gap-1.5 md:gap-3 rounded-full border px-1.5 py-1.5 md:px-4 md:py-3 font-mono text-xs md:text-base backdrop-blur-md whitespace-nowrap mx-auto ${className}`}
        style={{
          background: 'rgba(219, 231, 255, 0.35)',
          borderColor: 'rgba(19, 38, 238, 0.25)',
          boxShadow: '0 4px 24px rgba(19, 38, 238, 0.12)',
        }}
      >
        {items.map((item, i) => {
          const isActive = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => (pillRefs.current[i] = el)}
              onMouseEnter={(e) => handleEnter(e.currentTarget)}
              onMouseLeave={(e) => handleLeave(e.currentTarget)}
              className="rounded-full px-3 py-1.5 md:px-6 md:py-2.5 transition-colors shrink-0"
              style={{
                background: isActive ? accentColor : 'transparent',
                color: isActive ? activeTextColor : textColor,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}