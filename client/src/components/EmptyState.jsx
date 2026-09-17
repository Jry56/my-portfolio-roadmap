import BrandMark from './BrandMark';

function EmptyState({ title, body }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        textAlign: 'center',
        padding: 24,
      }}
    >
      <BrandMark size={48} title="Chatter" />
      <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
      <p style={{ color: 'var(--slate)', maxWidth: '32ch' }}>{body}</p>
    </div>
  );
}

export default EmptyState;
