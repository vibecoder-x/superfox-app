'use client';

import { useEffect, useRef } from 'react';

/** Keep focus useful when a hub swaps its content without changing the URL. */
export function useViewFocus(view: string, hub: string) {
  const viewRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const triggerKeyRef = useRef('');
  const previousViewRef = useRef(view);
  useEffect(() => {
    if (previousViewRef.current === view) return;
    previousViewRef.current = view;
    if (view === hub) {
      // Hub buttons remount after leaving an activity; find the replacement node.
      const replacement = Array.from(viewRef.current?.querySelectorAll<HTMLElement>('[data-focus-return]') ?? [])
        .find(element => element.dataset.focusReturn === triggerKeyRef.current);
      if (replacement) { replacement.focus(); return; }
      if (triggerRef.current?.isConnected) { triggerRef.current.focus(); return; }
    }
    viewRef.current?.focus();
  }, [view, hub]);
  const rememberTrigger = (trigger: HTMLElement) => {
    triggerRef.current = trigger;
    triggerKeyRef.current = trigger.dataset.focusReturn ?? '';
  };
  return { viewRef, rememberTrigger };
}
