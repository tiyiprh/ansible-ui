import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface PrototypeNotesEntry {
  id: string;
  title: string;
  content: ReactNode;
}

interface PrototypeNotesRegistryContextValue {
  activeEntry: PrototypeNotesEntry | null;
  registerNotes: (entry: PrototypeNotesEntry) => () => void;
}

const PrototypeNotesRegistryContext = createContext<PrototypeNotesRegistryContextValue | null>(
  null
);

export function PrototypeNotesRegistryProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [entries, setEntries] = useState<Record<string, PrototypeNotesEntry>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const registerNotes = useCallback((entry: PrototypeNotesEntry) => {
    setEntries((prev) => ({ ...prev, [entry.id]: entry }));
    setActiveId(entry.id);
    return () => {
      setEntries((prev) => {
        const next = { ...prev };
        delete next[entry.id];
        const remainingIds = Object.keys(next);
        setActiveId(remainingIds.length > 0 ? (remainingIds.at(-1) ?? null) : null);
        return next;
      });
    };
  }, []);

  const activeEntry = activeId ? (entries[activeId] ?? null) : null;

  const value = useMemo(
    () => ({
      activeEntry,
      registerNotes,
    }),
    [activeEntry, registerNotes]
  );

  return (
    <PrototypeNotesRegistryContext.Provider value={value}>
      {children}
    </PrototypeNotesRegistryContext.Provider>
  );
}

export function usePrototypeNotesRegistry() {
  const context = useContext(PrototypeNotesRegistryContext);
  if (!context) {
    throw new Error('usePrototypeNotesRegistry must be used within PrototypeNotesRegistryProvider');
  }
  return context;
}

export function useRegisterPrototypeNotes(entry: PrototypeNotesEntry) {
  const { registerNotes } = usePrototypeNotesRegistry();
  const entryRef = useRef(entry);
  entryRef.current = entry;

  useEffect(() => {
    return registerNotes(entryRef.current);
  }, [entry.id, registerNotes]);

  useEffect(() => {
    registerNotes(entryRef.current);
  }, [entry.content, entry.title, registerNotes]);
}
