import * as React from "react";
import styled from "@emotion/styled";

import useCountdown from '../shared/use-countdown';

function formatCountdown (seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  return mm + ':' + ss;
}

function stopTimer (e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  window.PopUp.sendMessage({ type: 'stop', service: 'dropdown', respond: true });
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
  const countdown = useCountdown(props.entry.start, props.interval);
  const strokeDashoffset = (countdown / (props.interval * 60)) * 892;

  return (
    <Container>
      <Clock>
        <Countdown x="50%" y="50%">
          {formatCountdown(countdown)}
        </Countdown>
        <circle stroke="#eee" {...ringProps} />
        <ActiveRing {...ringProps} style={{ strokeDashoffset }} />
        <Stop width="72" height="72" rx="2" x="114" y="114" onClick={stopTimer} />
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
  stroke: #e57cd8;
  stroke-dasharray: 892 892;
  animation-iteration-count: 1;
`;

const Stop = styled.rect`
  fill: #ff897a;
  opacity: 0;
  transition: 0.2s opacity ease-in;
  cursor: pointer;
`;

const Countdown = styled.text`
  font-size: 55px;
  color: #333;
  opacity: 100%;
  dominant-baseline: middle;
  text-anchor: middle;
  transition: 0.2s opacity ease-in;
`;
