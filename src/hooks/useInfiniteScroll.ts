import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll(
  loadMore: () => void,
  options: UseInfiniteScrollOptions
) {
  const { hasMore, loading, threshold = 100 } = options;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(loadMore);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Keep loadMore function reference up to date
  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (entry.isIntersecting && hasMore && !loading) {
        // Throttle rapid intersection events
        if (throttleRef.current) {
          clearTimeout(throttleRef.current);
        }
        
        throttleRef.current = setTimeout(() => {
          loadMoreRef.current();
        }, 100);
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [handleIntersection, threshold]);

  return sentinelRef;
}