import { useEffect, useState } from 'react';

/**
 * Tracks whether the viewport is a phone-sized screen (<= 768px).
 * Also exposes `isSmall` (<= 480px) for finer control.
 */
export function useIsMobile() {
  const query = '(max-width: 768px)';
  const smallQuery = '(max-width: 480px)';

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(smallQuery).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sq = window.matchMedia(smallQuery);
    const onChange = () => setIsMobile(mq.matches);
    const onSmallChange = () => setIsSmall(sq.matches);
    mq.addEventListener('change', onChange);
    sq.addEventListener('change', onSmallChange);
    return () => {
      mq.removeEventListener('change', onChange);
      sq.removeEventListener('change', onSmallChange);
    };
  }, []);

  return { isMobile, isSmall };
}
