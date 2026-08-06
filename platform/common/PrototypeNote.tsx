import { ReactNode, useState } from 'react';

interface PrototypeNoteProps {
  notes?: ReactNode[];
  questions?: ReactNode[];
}

/**
 * PrototypeNote — a collapsible, visually distinct annotation for UX prototypes.
 * Intentionally styled to look out-of-place so reviewers know it is a design note.
 * Click the badge to toggle open/closed.
 *
 * Pass notes for implementation/design observations and questions for items
 * needing PM or team input.
 */
export function PrototypeNote({ notes = [], questions = [] }: Readonly<PrototypeNoteProps>) {
  const [open, setOpen] = useState(true);
  const hasNotes = notes.length > 0;
  const hasQuestions = questions.length > 0;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          margin: '8px 24px',
          padding: '3px 10px',
          background: '#fff8e1',
          border: '1px solid #f9a825',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: '#f57f17',
          cursor: 'pointer',
        }}
      >
        📋 Design Note
      </button>
    );
  }

  return (
    <div
      style={{
        background: '#fffde7',
        border: '2px dashed #f9a825',
        borderRadius: '6px',
        padding: '10px 14px',
        margin: '16px 24px',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: '1.6',
        color: '#555',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#f57f17',
          }}
        >
          Design Note
        </span>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '11px',
            color: '#f57f17',
            fontFamily: 'monospace',
            padding: '0 2px',
            lineHeight: 1,
          }}
          aria-label="Collapse design note"
        >
          ✕
        </button>
      </div>
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
          <div className="prototype-note-section-heading">Questions</div>
          <ul className="prototype-note-list">
            {questions.map((question, i) => (
              <li key={i}>{question}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
