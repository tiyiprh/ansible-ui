import { ReactNode, useState } from 'react';

interface PrototypeNoteProps {
  notes?: ReactNode[];
  questions?: ReactNode[];
  defaultOpen?: boolean;
}

const containerStyle = {
  border: '2px dashed #f9a825',
  borderRadius: '6px',
  fontFamily: 'monospace',
  fontSize: '12px',
  lineHeight: '1.6',
  color: '#555',
  margin: '16px 0',
  width: '100%',
} as const;

const headerButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '10px 14px',
  fontFamily: 'monospace',
  textAlign: 'left' as const,
};

const labelStyle = {
  fontWeight: 700,
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#f57f17',
};

/**
 * PrototypeNote — a collapsible, visually distinct annotation for UX prototypes.
 * Intentionally styled to look out-of-place so reviewers know it is a design note.
 * Collapsed by default; click the header to expand or collapse.
 */
export function PrototypeNote({
  notes = [],
  questions = [],
  defaultOpen = false,
}: Readonly<PrototypeNoteProps>) {
  const [open, setOpen] = useState(defaultOpen);
  const hasNotes = notes.length > 0;
  const hasQuestions = questions.length > 0;

  return (
    <div
      style={{
        ...containerStyle,
        background: open ? '#fffde7' : '#fff8e1',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          style={headerButtonStyle}
          aria-expanded={open}
        >
          <span style={labelStyle}>
            {open ? '▼' : '▶'} Design Note
          </span>
        </button>
        {open && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#f57f17',
              fontFamily: 'monospace',
              padding: '10px 14px 10px 0',
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Collapse design note"
          >
            ✕
          </button>
        )}
      </div>
      {open && (
        <div style={{ padding: '0 14px 10px 14px' }}>
          <style>{`
            .prototype-note-section-heading {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              color: #b8860b;
              margin: 8px 0 2px 0;
            }
            .prototype-note-section-heading:first-child {
              margin-top: 0;
            }
            .prototype-note-list {
              margin: 2px 0 0 0;
              padding-left: 16px;
              list-style: disc;
            }
            .prototype-note-list li {
              margin-bottom: 2px;
            }
          `}</style>
          {hasNotes && (
            <>
              {hasQuestions && <div className="prototype-note-section-heading">Notes</div>}
              <ul className="prototype-note-list">
                {notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </>
          )}
          {hasQuestions && (
            <>
              <div className="prototype-note-section-heading">Open Questions</div>
              <ul className="prototype-note-list">
                {questions.map((question, i) => (
                  <li key={i}>{question}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
