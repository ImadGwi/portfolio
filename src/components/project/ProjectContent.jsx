// src/components/project/ProjectContent.jsx
export default function ProjectContent({ project, sections }) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {project.problem && <Block title="The Problem" text={project.problem} />}
      {project.solution && <Block title="The Solution" text={project.solution} />}
      {project.fullDescription && <Block title="About This Project" text={project.fullDescription} />}
      {sections?.map((section) => (
        <Block key={section.id} title={section.title} text={section.content} />
      ))}
    </section>
  );
}

function Block({ title, text }) {
  if (!text) return null;
  return (
    <div>
      {title && (
        <h2 className="text-sm tracking-widest uppercase mb-3" style={{ color: 'var(--chrome)' }}>
          {title}
        </h2>
      )}
      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>
        {text}
      </p>
    </div>
  );
}