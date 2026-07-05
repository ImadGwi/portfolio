// src/app/page.js
import BioSection from '@/components/main/BioSection';
import StacksSection from '@/components/main/StacksSection';
import ProjectsSection from '@/components/project/ProjectsSection';
import CommentsAndMessage from '@/components/main/CommentsAndMessage';
import { GridScan } from '@/components/motion/GridScan';
import PillNav from '@/components/motion/PillNav';


const items = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Projects',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

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
          scanColor="#1326EE"
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
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
         <PillNav
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Stacks' , href: '/#stacks'},
              { label: 'Projets', href: '/#projects' },
              { label: 'Contact', href: '/#comments' },
              { label: 'À propos', href: '/#bio' },
            ]}
            activeHref="/"
          />
        </div>
        <BioSection />
        <StacksSection />
        <ProjectsSection />
        <CommentsAndMessage />
      </div>

    </main>
  );
}