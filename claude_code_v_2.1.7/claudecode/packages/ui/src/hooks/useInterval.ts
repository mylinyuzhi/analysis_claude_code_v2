import { useEffect, useRef } from 'react';

/**
 * useInterval - Custom hook for setting up intervals
 * Similar to XZ in chunks.107.mjs
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
}
