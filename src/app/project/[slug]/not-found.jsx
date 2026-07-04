// src/app/project/[slug]/not-found.jsx
import Link from 'next/link';
import { GridScan } from '@/components/motion/GridScan';

export default function ProjectNotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden crt-scanlines">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'var(--bg)' }}
      >
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#2F293A"
          gridScale={0.1}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          lineJitter={0.1}
          scanGlow={0.5}
          scanSoftness={2}
          enableWebcam={false}
          showPreview={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center font-mono">
        <span
          className="text-7xl font-bold tracking-widest"
          style={{ color: 'var(--primary-blue, #03045E)' }}
        >
          404
        </span>
        <h1 className="text-xl">Projet introuvable</h1>
        <p className="max-w-md text-sm opacity-70">
          Le projet que vous cherchez n&apos;existe pas ou a été déplacé.
        </p>

        <Link
          href="/"
          className="mt-4 rounded-md border bg-transparent px-4 py-2 text-sm transition-colors"
          style={{
            borderColor: '#ffffff',
            color: '#ffffff',
            mixBlendMode: 'difference',
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}