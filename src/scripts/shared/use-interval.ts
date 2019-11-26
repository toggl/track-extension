import * as React from 'react';

/**
 * Executes the passed callback at specifed delay
 */
export function useInterval (callback: () => void, delay: number) {
  const savedCallback = React.useRef<typeof callback>();

  // Remember the latest function.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick () {
      if (savedCallback.current) {
        requestAnimationFrame(savedCallback.current);
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
