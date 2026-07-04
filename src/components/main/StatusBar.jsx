// src/components/main/StatusBar.jsx
export default function StatusBar() {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 text-xs tracking-wide border-b"
      style={{ background: 'var(--bg-pane)', borderColor: 'var(--border)', color: 'var(--chrome)' }}
    >
      <span>imad@portfolio</span>
      <span style={{ color: 'var(--text-dim)' }}>session: /home/imad — 1 pane running</span>
      <span>● online</span>
    </div>
  );
}