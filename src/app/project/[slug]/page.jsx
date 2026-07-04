// src/app/project/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/components/project/projectApi';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectContent from '@/components/project/ProjectContent';
import ProjectMedia from '@/components/project/ProjectMedia';
import ProjectComments from '@/components/project/ProjectComments';
import ProjectBackButton from '@/components/project/ProjectBackButton';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const { project, stacks, sections, media } = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen crt-scanlines" style={{ background: 'var(--bg)' }}>
      <ProjectBackButton />
      <ProjectHero project={project} stacks={stacks} />
      <ProjectContent project={project} sections={sections} />
      <ProjectMedia media={media} />
      <ProjectComments projectId={project.id} />
    </main>
  );
}