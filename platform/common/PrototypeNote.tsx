import GripVerticalIcon from '@patternfly/react-icons/dist/esm/icons/grip-vertical-icon';
import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePrototypeNoteFloatingContext } from './PrototypeNoteFloatingContext';

interface PrototypeNoteProps {
  notes?: ReactNode[];
  questions?: ReactNode[];
  defaultOpen?: boolean;
  /** Fixed panel mode — enables drag handle and viewport positioning. */
  floating?: boolean;
  panelTitle?: string;
}

const PANEL_WIDTH = 475;
const PANEL_MAX_HEIGHT_VH = 60;
const FLOATING_Z_INDEX = 1101;
const ANCHOR_GAP = 8;
const STORAGE_KEY = 'prototype-design-notes-position';

const containerStyle = {
  border: '2px dashed #f9a825',
  borderRadius: '6px',
  fontSize: '13px',
  lineHeight: 1.5,
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
  textAlign: 'left' as const,
};

const labelStyle = {
  fontWeight: 700,
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#f57f17',
};

interface PanelPosition {
  left: number;
  bottom: number;
}

function clampPosition(left: number, bottom: number, panelHeight: number): PanelPosition {
  const maxLeft = Math.max(16, window.innerWidth - PANEL_WIDTH - 16);
  const maxBottom = Math.max(16, window.innerHeight - panelHeight - 16);
  return {
    left: Math.min(Math.max(16, left), maxLeft),
    bottom: Math.min(Math.max(16, bottom), maxBottom),
  };
}

function getPositionFromAnchor(anchor: HTMLElement, panelHeight: number): PanelPosition {
  const rect = anchor.getBoundingClientRect();
  // Bottom-left of the panel sits just above the top-right corner of the launcher (chatbot-style).
  const left = rect.right;
  const bottom = window.innerHeight - rect.top + ANCHOR_GAP;
  return clampPosition(left, bottom, panelHeight);
}

const DEFAULT_FLOATING_POSITION: PanelPosition = { left: 16, bottom: 56 };

/**
 * PrototypeNote — a collapsible, visually distinct annotation for UX prototypes.
 * Intentionally styled to look out-of-place so reviewers know it is a design note.
 * Collapsed by default; click the header to expand or collapse.
 *
 * Pass `floating` (or wrap in `PrototypeNoteFloatingContext`) for a draggable
 * fixed panel used by the design-notes launcher.
 */
export function PrototypeNote({
  notes = [],
  questions = [],
  defaultOpen = false,
  floating: floatingProp,
  panelTitle: panelTitleProp,
}: Readonly<PrototypeNoteProps>) {
  const floatingContext = usePrototypeNoteFloatingContext();
  const floating = floatingProp ?? floatingContext?.floating ?? false;
  const panelTitle = panelTitleProp ?? floatingContext?.panelTitle;
  const onDismiss = floatingContext?.onDismiss;
  const anchorRef = floatingContext?.anchorRef;

  const [open, setOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<PanelPosition>(DEFAULT_FLOATING_POSITION);
  positionRef.current = position ?? DEFAULT_FLOATING_POSITION;
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startLeft: number;
    startBottom: number;
  } | null>(null);

  const hasNotes = notes.length > 0;
  const hasQuestions = questions.length > 0;

  useLayoutEffect(() => {
    if (!floating) return;
    const panelHeight = panelRef.current?.offsetHeight ?? 320;
    const anchor = anchorRef?.current;
    if (anchor) {
      setPosition(getPositionFromAnchor(anchor, panelHeight));
      return;
    }
    setPosition(
      clampPosition(DEFAULT_FLOATING_POSITION.left, DEFAULT_FLOATING_POSITION.bottom, panelHeight)
    );
  }, [floating, anchorRef, open]);

  useEffect(() => {
    if (!floating) {
      setPosition(null);
      return;
    }
    const handleResize = () => {
      const panelHeight = panelRef.current?.offsetHeight ?? 320;
      setPosition((prev) => {
        if (!prev) return prev;
        return clampPosition(prev.left, prev.bottom, panelHeight);
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [floating]);

  const persistPosition = useCallback((next: PanelPosition) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const dismissFloatingPanel = () => {
    onDismiss?.();
  };

  const handleHeaderClick = () => {
    if (floating && onDismiss) {
      dismissFloatingPanel();
      return;
    }
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    if (floating && onDismiss) {
      dismissFloatingPanel();
      return;
    }
    setOpen(false);
  };

  const isExpanded = floating || open;

  const handleDragPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!floating || event.button !== 0) return;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: position.left,
      startBottom: position.bottom,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleDragPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const panelHeight = panelRef.current?.offsetHeight ?? 320;
    const next = clampPosition(drag.startLeft + deltaX, drag.startBottom - deltaY, panelHeight);
    setPosition(next);
  };

  const handleDragPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragStateRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    persistPosition(positionRef.current);
  };

  const noteBody = isExpanded ? (
    <div
      style={{
        padding: '0 14px 10px 14px',
        overflow: floating ? 'auto' : undefined,
        flex: floating ? 1 : undefined,
        minHeight: floating ? 0 : undefined,
      }}
    >
      <style>{`
        .prototype-note-section-heading {
          font-size: 11px;
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
        .prototype-note-list a {
          color: #1b1d21;
          font-weight: 400;
          text-decoration: underline;
        }
        .prototype-note-list a:hover {
          color: #0066cc;
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
  ) : null;

  return (
    <div
      ref={panelRef}
      style={{
        ...containerStyle,
        background: isExpanded ? '#fffde7' : '#fff8e1',
        ...(floating
          ? {
              position: 'fixed',
              left: position?.left ?? DEFAULT_FLOATING_POSITION.left,
              bottom: position?.bottom ?? DEFAULT_FLOATING_POSITION.bottom,
              width: PANEL_WIDTH,
              maxHeight: `${PANEL_MAX_HEIGHT_VH}vh`,
              margin: 0,
              zIndex: FLOATING_Z_INDEX,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.18)',
              visibility: position ? 'visible' : 'hidden',
            }
          : {}),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {floating && (
          <div
            role="presentation"
            aria-hidden
            onPointerDown={handleDragPointerDown}
            onPointerMove={handleDragPointerMove}
            onPointerUp={handleDragPointerUp}
            onPointerCancel={handleDragPointerUp}
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 8,
              cursor: 'grab',
              userSelect: 'none',
              flexShrink: 0,
            }}
          >
            <GripVerticalIcon style={{ color: '#b8860b' }} />
          </div>
        )}
        <button
          type="button"
          onClick={handleHeaderClick}
          style={{
            ...headerButtonStyle,
            flex: 1,
            padding: floating ? '10px 8px 10px 0' : undefined,
          }}
          aria-expanded={isExpanded}
        >
          <span style={labelStyle}>
            {isExpanded ? '▼' : '▶'} Design Note
            {floating && panelTitle ? ` — ${panelTitle}` : ''}
          </span>
        </button>
        {isExpanded && (
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#f57f17',
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
      {noteBody}
    </div>
  );
}
