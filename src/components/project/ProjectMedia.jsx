// src/components/project/ProjectMedia.jsx
export default function ProjectMedia({ media }) {
  if (!media?.length) return null;
  media = [...media, ...media , ...media]

  return (
    <section className="max-w-4xl mx-auto px-6 pb-12">
      <h2 className="text-sm tracking-widest uppercase mb-4" style={{ color: 'var(--chrome)' }}>
        Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {media.map((item , index) => (
          <figure
            key={index}
            className="rounded border overflow-hidden"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-pane)' }}
          >
            {item.type === 'video' ? (
              <video src={item.url} controls className="w-full h-auto" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt={item.text || ''} className="w-full h-auto" />
            )}
            {item.text && (
              <figcaption className="text-xs px-3 py-2" style={{ color: 'var(--text-dim)' }}>
                {item.text}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}