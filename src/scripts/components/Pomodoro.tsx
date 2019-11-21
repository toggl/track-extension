import * as React from "react";
import { differenceInSeconds } from "date-fns";
import styled from "@emotion/styled";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function getCountdown(start: string, interval: number) {
  const intervalSeconds = interval * 60;
  const elapsed = differenceInSeconds(new Date(), start);
  return intervalSeconds - elapsed;
}

const ringProps = {
  r: "142",
  cx: "150",
  cy: "150",
  strokeWidth: 3,
  fill: "transparent",
  transform: "rotate(-90, 150, 150)"
};

interface PomodoroProps {
  entry: Toggl.TimeEntry;
  interval: number;
}
export default function Pomodoro(props: PomodoroProps) {
  const [countdown, setCountdown] = React.useState(
    getCountdown(props.entry.start, props.interval)
  );

  React.useEffect(() => {
    if (!countdown) return;
    const intervalId = setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  const strokeDashoffset = (countdown / (props.interval * 60)) * 892;

  const stopTimer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.PopUp.sendMessage({ type: 'stop', service: 'dropdown', respond: true });
  };

  return (
    <Container>
      <Clock>
        <Countdown x="50%" y="50%">
          {formatDuration(countdown)}
        </Countdown>
        <circle stroke="#eee" {...ringProps} />
        <ActiveRing {...ringProps} style={{ strokeDashoffset }} />
        <Stop width="60" height="60" rx="2" x="120" y="120" onClick={stopTimer} />
      </Clock>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 410px;
`;

const Clock = styled.svg`
  cursor: pointer;
  width: 300px;
  height: 300px;
  &:hover text {
    opacity: 0%;
  }
  &:hover rect {
    opacity: 100%;
  }
`;

const ActiveRing = styled.circle`
  stroke: #e20505;
  stroke-dasharray: 892 892;
  animation-iteration-count: 1;
`;

const Stop = styled.rect`
  fill: #f41d1d;
  opacity: 0;
  transition: 0.2s opacity ease-in;
`;

const Countdown = styled.text`
  font-size: 55px;
  color: #333;
  opacity: 100%;
  dominant-baseline: middle;
  text-anchor: middle;
  transition: 0.2s opacity ease-in;
`;
