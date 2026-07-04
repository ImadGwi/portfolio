// src/components/project/ProjectHero.jsx
const STATUS_META = {
  planned: { label: 'Planned', color: '#7c8873', dot: '#7c8873' },
  in_progress: { label: 'In Progress', color: '#e0a458', dot: '#e0a458' },
  completed: { label: 'Completed', color: '#7ee787', dot: '#7ee787' },
  archived: { label: 'Archived', color: '#e05252', dot: '#e05252' },
};

export default function ProjectHero({ project, stacks }) {
  const status = STATUS_META[project.status] || STATUS_META.planned;
  const banner = project.coverpageUrl || project.coverImage;

  return (
    <section className="relative">
      {banner && (
        <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt={project.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--bg) 0%, rgba(12,15,10,0.45) 55%, rgba(12,15,10,0.05) 100%)',
            }}
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative">
        <div className="rounded border p-6" style={{ background: 'var(--bg-pane)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ background: status.dot }} />
            <span className="text-xs tracking-wide" style={{ color: status.color }}>
              {status.label}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
              {project.shortDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
            {project.role && (
              <span>
                Role: <span style={{ color: 'var(--text)' }}>{project.role}</span>
              </span>
            )}
            {project.duration && (
              <span>
                Duration: <span style={{ color: 'var(--text)' }}>{project.duration}</span>
              </span>
            )}
          </div>

          {stacks?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>Built with</p>
              <div className="flex flex-wrap gap-2">
                {stacks.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded border"
                    style={{ borderColor: s.color || 'var(--border)', color: s.color || 'var(--text)' }}
                  >
                    {s.icon && (
                      <span
                        className="w-3.5 h-3.5 shrink-0 [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: s.icon }}
                      />
                    )}
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2 rounded font-medium"
                style={{ background: '#7ee787', color: 'var(--bg)' }}
              >
                View live demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2 rounded border"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                View source code
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}