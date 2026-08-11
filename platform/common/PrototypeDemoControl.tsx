import { ReactNode } from 'react';

export function PrototypeDemoControl({ children }: Readonly<{ children: ReactNode }>) {
  if (import.meta.env.VITE_DEMO_MODE !== 'true') {
    return null;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 10px',
        background: '#fffde7',
        border: '2px dashed #f9a825',
        borderRadius: 6,
        fontSize: 13,
        lineHeight: 1.5,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: '#5d4037',
      }}
    >
      <span style={{ textTransform: 'uppercase' }}>Prototype</span>
      {children}
    </div>
  );
}
