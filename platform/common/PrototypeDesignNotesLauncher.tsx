import { Button } from '@patternfly/react-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PrototypeNoteFloatingContext } from './PrototypeNoteFloatingContext';
import { usePrototypeNotesRegistry } from './PrototypeNotesRegistry';

const LAUNCHER_Z_INDEX = 1101;

export function PrototypeDesignNotesLauncher() {
  const { t } = useTranslation();
  const { activeEntry } = usePrototypeNotesRegistry();
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  const hasNotes = Boolean(activeEntry);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!hasNotes) {
      setIsOpen(false);
    }
  }, [hasNotes]);

  const floatingContextValue = useMemo(
    () =>
      activeEntry
        ? {
            floating: true as const,
            panelTitle: activeEntry.title,
            onDismiss: handleDismiss,
            anchorRef: launcherRef,
          }
        : null,
    [activeEntry, handleDismiss]
  );

  if (import.meta.env.VITE_DEMO_MODE !== 'true' || !hasNotes) {
    return null;
  }

  return (
    <>
      <div
        ref={launcherRef}
        style={{
          position: 'fixed',
          left: 16,
          bottom: 16,
          zIndex: LAUNCHER_Z_INDEX,
        }}
      >
        <Button
          variant="plain"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            border: '2px dashed #f9a825',
            background: '#fffde7',
            fontSize: 13,
            lineHeight: 1.5,
            fontWeight: 700,
            color: '#5d4037',
            padding: '8px 10px',
            borderRadius: 8,
          }}
        >
          {t('View design notes')}
        </Button>
      </div>

      {isOpen && floatingContextValue && (
        <PrototypeNoteFloatingContext.Provider value={floatingContextValue}>
          {activeEntry?.content}
        </PrototypeNoteFloatingContext.Provider>
      )}
    </>
  );
}
