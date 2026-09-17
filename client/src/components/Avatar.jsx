const PALETTE = ['#3A6351', '#E1AA74', '#14213D', '#6B7280', '#B3452E', '#4D7D68'];

function colorFromSeed(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initialsFrom(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Renders a person's initials on a deterministic color, so every user gets a
 * stable, distinct avatar without loading an external image. `name` is used
 * for both the initials and the accessible label.
 */
function Avatar({ name, seed, size = 44, online = false }) {
  const background = colorFromSeed(seed || name || '');
  const initials = initialsFrom(name);

  return (
    <span
      style={{ position: 'relative', display: 'inline-block', width: size, height: size, flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        role="img"
        aria-label={`${name || 'Unknown user'}'s avatar`}
      >
        <circle cx="22" cy="22" r="22" fill={background} />
        <text
          x="22"
          y="22"
          dy=".08em"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#F7F5F0"
          fontFamily="Sora, system-ui, sans-serif"
          fontWeight="600"
          fontSize="17"
        >
          {initials}
        </text>
      </svg>
      {online && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: '50%',
            background: '#3A6351',
            border: '2px solid #F7F5F0',
          }}
        />
      )}
    </span>
  );
}

export default Avatar;
