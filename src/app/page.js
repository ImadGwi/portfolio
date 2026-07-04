// src/app/page.js
import BioSection from '@/components/main/BioSection';
import StacksSection from '@/components/main/StacksSection';
import ProjectsSection from '@/components/project/ProjectsSection';
import CommentsAndMessage from '@/components/main/CommentsAndMessage';
import { GridScan } from '@/components/motion/GridScan';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: 'var(--bg)' }}
      >
        <GridScan
          scanDuration ={3.5}

          sensitivity={0.55}
          lineThickness={1}
          linesColor="#2F293A"
          gridScale={0.05}
          scanColor="#FF9FFC"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          lineJitter={0.1}
          scanGlow={0.2}
          scanSoftness={2}
          enableWebcam={false}
          showPreview={false}
          
        />
      </div>

      {/* Page content */}
      <div className="relative z-10">
        <BioSection />
        <StacksSection />
        <ProjectsSection />
        <CommentsAndMessage />

      </div>
    </main>
  );
}