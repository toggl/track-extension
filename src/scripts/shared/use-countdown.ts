import * as React from 'react';
import { differenceInSeconds } from 'date-fns';
import useInterval from './use-interval';

const ONE_SECOND = 1000;

export default function useCountdown (start: string, delta: number) {
  const [countdown, setCountdown] = React.useState(
    getCountdown(start, delta)
  );

  const updateCountdown = React.useCallback(() => {
    setCountdown(countdown - 1);
  }, [setCountdown, countdown]);

  useInterval(updateCountdown, ONE_SECOND);

  return countdown;
}

function getCountdown (start: string, interval: number) {
  const intervalSeconds = interval * 60;
  const elapsed = differenceInSeconds(new Date(), start);
  return intervalSeconds - elapsed;
}
