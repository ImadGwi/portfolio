// src/components/project/ProjectCard.jsx
import Link from 'next/link';
import Image from 'next/image';

const STATUS_META = {
  planned: { label: 'Planned', color: '#7c8873', dot: '#7c8873' },
  in_progress: { label: 'In Progress', color: '#e0a458', dot: '#e0a458' },
  completed: { label: 'Completed', color: '#7ee787', dot: '#7ee787' },
  archived: { label: 'Archived', color: '#e05252', dot: '#e05252' },
};

export default function ProjectCard({ project }) {
  const status = STATUS_META[project.status] || STATUS_META.planned;

  return (
    <div
      className="group rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
      style={{ background: 'var(--bg-pane)', borderColor: 'var(--border)' }}
    >
      <Link href={`/project/${project.slug}`} className="block">
        {project.coverImage && (
          <div className="relative aspect-video border-b overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />

            {/* Status badge */}
            <span
              className="absolute top-2.5 left-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.6)', color: status.color }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: status.dot, boxShadow: `0 0 6px ${status.dot}` }}
              />
              {status.label}
            </span>

            {project.isFeatured && (
              <span
                className="absolute top-2.5 right-2.5 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#e0a458' }}
              >
                ★ Featured
              </span>
            )}
          </div>
        )}

        <div className="p-4" style={{ color: 'var(--text)' }}>
          {/* Title */}
          <h3 className="text-sm font-semibold mb-1 group-hover:opacity-90 transition-opacity">
            {project.title}
          </h3>

          {/* Role & Duration */}
          <div className="flex items-center gap-2 text-[11px] mb-3" style={{ color: 'var(--text-dim)' }}>
            {project.role && <span>{project.role}</span>}
            {project.role && project.duration && <span style={{ opacity: 0.4 }}>·</span>}
            {project.duration && <span>{project.duration}</span>}
          </div>

          {/* Description */}
          {project.shortDescription && (
            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: 'var(--text-dim)' }}
            >
              {project.shortDescription}
            </p>
          )}
        </div>
      </Link>

      {/* Links footer */}
      {(project.githubUrl || project.liveUrl) && (
        <div
          className="flex items-center gap-3 text-xs px-4 pb-3.5 pt-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-100 opacity-60 transition-opacity"
              style={{ color: 'var(--text)' }}
            >
              <Image
                src="/logo/github.png"
                alt="GitHub"
                width={15}
                height={15}
                className="w-[15px] h-[15px] object-contain invert opacity-80"
              />
              Source
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-100 opacity-60 transition-opacity"
              style={{ color: '#7ee787' }}
            >
              <span className="text-[10px]">↗</span>
              Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}