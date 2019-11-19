import * as React from 'react';
import styled from '@emotion/styled';
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subHours,
  subMinutes
} from 'date-fns';
import * as keycode from 'keycode';

import { TimeEntryDescription, TimeEntryProject } from './TimeEntriesList';
import TagsIcon from './TagsIcon';
import start from '../icons/start.svg';
import stop from '../icons/stop.svg';

const NO_DESCRIPTION = '(no description)';

/**
 * Returns the elapsed time since `since` as a duration in the format hh:mm:ss.
 */
export const formatDuration = (start: string | number, stop?: string | number) => {
  const now = stop || Date.now();
  const hours = differenceInHours(now, start);
  const minutes = differenceInMinutes(subHours(now, hours), start);
  const seconds = differenceInSeconds(subMinutes(subHours(now, hours), minutes), start);
  const timeValue = (value) => value > 9 ? value : (value > 0 ? '0' + value : '00');

  return `${hours}:${timeValue(minutes)}:${timeValue(seconds)}`;
}

type TimerProps = {
  entry: Toggl.TimeEntry | null;
  project: Toggl.Project | null;
};

function Timer (props: TimerProps) {
  return props.entry
    ? <RunningTimer entry={props.entry} project={props.project} />
    : <TimerForm />
}

function RunningTimer(props: { entry: Toggl.TimeEntry, project: Toggl.Project | null }) {
  const { entry, project } = props;
  const tags = (entry.tags || []).join(', ');

  const editEntry = (e: React.MouseEvent) => {
    window.PopUp.renderEditForm(entry);
  };
  const stopTimer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.PopUp.sendMessage({ type: 'stop', service: 'dropdown', respond: true });
  };

  return (
    <TimerContainer onClick={editEntry}>
      <div>
        <TimeEntryDescription title={`Click to edit ${entry.description || ''}`} running>
          {entry.description || NO_DESCRIPTION}
        </TimeEntryDescription>
        {project &&
          <TimeEntryProject project={project} />
        }
      </div>
      <div>
        {tags && <TagsIcon title={tags} />}
        <TimerDuration start={entry.start} />
        <TimerButton isRunning onClick={stopTimer} />
      </div>
    </TimerContainer>
  );
}

function TimerDuration ({ start }: { start: string }) {
  const [ duration, setDuration ] = React.useState(formatDuration(start));

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDuration(formatDuration(start));
    }, 1000);
    return () => clearTimeout(timeoutId);
  })

  return (
    <Duration>
      {duration}
    </Duration>
  )
}

function TimerForm () {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const startTimer = (e) => {
    e.preventDefault();
    const description = inputRef && inputRef.current
      ? inputRef.current.value
      : '';
    window.PopUp.sendMessage({ type: 'timeEntry', description, service: 'dropdown', respond: true });
  };
  const onKeyUp = (e) => {
    if (keycode(e.which) === 'enter') {
      startTimer(e);
    }
  }

  return (
    <TimerContainer>
      <TimerInput ref={inputRef} onKeyUp={onKeyUp} placeholder='What are you working on?' />
      <TimerButton isRunning={false} onClick={startTimer} />
    </TimerContainer>
  );
}

const TimerContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1rem;
  height: 66px;

  padding: .5rem .8rem;

  cursor: pointer;
  font-size: 14px;
  box-shadow: rgb(232, 232, 232) 0px -1px 0px 0px inset;
  background: #fff;

  > div:first-child {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  > div:last-child {
    display: flex;
    align-items: center;
  }
`;

const TimerInput = styled.input`
  flex: 1;
  height: 100%;
  padding-right: 1rem;
  border: none;

  font-size: 14px;

  &:hover, &:focus {
    outline: none;
  }
`;

const Duration = styled.div`
  padding: 0 .8rem;
`;


type TimerButtonProps = {
  isRunning: boolean;
};
const TimerButton = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  padding: 5px; /* Extra hit-area */
  background: url(${(props: TimerButtonProps) => props.isRunning ? stop : start}) no-repeat;
  background-position: 55% 50%;
  background-size: 24px;
  border: none;
  cursor: pointer;
`;

export default Timer;
