import * as React from 'react';
import { differenceInSeconds } from 'date-fns';
import useInterval from './use-interval';

const ONE_SECOND = 1000;

/**
 * Returns the duration since the startDate
 */
export const useDuration = (start: string) => {
  const [duration, setDuration] = React.useState(timeElapsed(start));

  const updateDuration = React.useCallback(() => {
    setDuration(timeElapsed(start));
  }, [setDuration]);

  useInterval(updateDuration, ONE_SECOND);

  return duration;
}

function timeElapsed (start: string) {
  const elapsed = differenceInSeconds(new Date(), start);
  return elapsed;
}
