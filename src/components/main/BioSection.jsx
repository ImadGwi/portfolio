// src/components/main/BioSection.jsx
import { getBio } from '@/components/main/mainApi';

export default async function BioSection() {
  const { bio } = await getBio();

  return (
    <section className="min-h-[70vh] flex flex-col justify-center px-6 py-16 crt-scanlines">
      <div className="max-w-6xl mx-auto w-full rounded border"
        style={{ background: 'var(--bg-pane)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#e05252' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#e0b452' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#7ee787' }} />
          <span className="ml-3 text-xs" style={{ color: 'var(--chrome)' }}>
            imad@portfolio:~$ cat about.md
          </span>
        </div>

        <div
          className="px-6 py-6 text-sm leading-relaxed prose prose-invert max-w-none"
          style={{ color: 'var(--text)' }}
          dangerouslySetInnerHTML={{ __html: bio || '<p style="color:var(--text-dim)">// about.md is empty</p>' }}
        />
      </div>
    </section>
  );
}