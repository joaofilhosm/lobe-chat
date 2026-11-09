import { useEffect, useRef } from 'react';

import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

/** Below this width the nav panel competes with the conversation for space. */
export const NAV_PANEL_AUTO_COLLAPSE_QUERY = '(max-width: 1023px)';

/**
 * Tablet behavior: collapse the nav panel on narrow viewports so the conversation
 * keeps the room, and restore it when the window widens again.
 *
 * It only restores a panel that it collapsed itself. If the user closes or opens
 * the panel by hand, that choice is never overridden.
 */
export const useAutoCollapseNavPanel = () => {
  const isStatusInit = useGlobalStore(systemStatusSelectors.isStatusInit);
  const collapsedByUs = useRef(false);

  useEffect(() => {
    if (!isStatusInit || typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia(NAV_PANEL_AUTO_COLLAPSE_QUERY);

    const sync = (narrow: boolean) => {
      const { toggleLeftPanel } = useGlobalStore.getState();
      const expanded = systemStatusSelectors.showLeftPanel(useGlobalStore.getState());

      if (narrow && expanded) {
        collapsedByUs.current = true;
        toggleLeftPanel(false);
      } else if (!narrow && !expanded && collapsedByUs.current) {
        collapsedByUs.current = false;
        toggleLeftPanel(true);
      } else if (!narrow) {
        collapsedByUs.current = false;
      }
    };

    sync(media.matches);

    const onChange = (event: MediaQueryListEvent) => sync(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [isStatusInit]);
};
