import { createContext, RefObject, useContext } from 'react';

export interface PrototypeNoteFloatingContextValue {
  floating: boolean;
  panelTitle?: string;
  onDismiss?: () => void;
  /** Launcher element — panel bottom-left anchors above its top-right on open. */
  anchorRef?: RefObject<HTMLElement | null>;
}

export const PrototypeNoteFloatingContext = createContext<PrototypeNoteFloatingContextValue | null>(
  null
);

export function usePrototypeNoteFloatingContext() {
  return useContext(PrototypeNoteFloatingContext);
}
