import * as React from 'react';
import styled from '@emotion/styled';
import { addSeconds } from 'date-fns';
import * as keycode from 'keycode';

import { formatDuration } from '../@toggl/time-format-utils/format-duration';

import { TimeEntryDescription, TimeEntryProject } from './TimeEntriesList';
import TagsIcon from './TagsIcon';
import start from '../icons/start.svg';
import stop from '../icons/stop.svg';
import { useDuration } from '../shared/use-duration';

const NO_DESCRIPTION = '(no description)';

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

  const editEntry = () => {
    window.PopUp.renderEditForm(entry);
  };

  return (
    <TimerContainer onClick={editEntry}>
      <RunningTimerDescription>
        <TimeEntryDescription title={`Click to edit ${entry.description || ''}`}>
          {entry.description || NO_DESCRIPTION}
        </TimeEntryDescription>
        {project &&
          <TimeEntryProject project={project} />
        }
      </RunningTimerDescription>
      <div>
        {tags && <TagsIcon title={tags} />}
        <TimerDuration start={entry.start} />
        <TimerButton isRunning onClick={stopTimer} />
      </div>
    </TimerContainer>
  );
}

function TimerDuration ({ start }: { start: string }) {
  const duration = useDuration(start);
  return (
    <Duration>
      {formatDuration(start, addSeconds(start, duration))}
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

const stopTimer = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  window.PopUp.sendMessage({ type: 'stop', service: 'dropdown', respond: true });
};

const TimerContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 66px;

  padding: .5rem .8rem;

  cursor: pointer;
  font-size: 14px;
  box-shadow: var(--border-color) 0px -1px 0px 0px inset;
  background: var(--base-color);

  > div:last-child {
    display: flex;
    align-items: center;
  }
`;

const RunningTimerDescription = styled.div`
  margin-left: 10px;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const TimerInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 1rem;
  border: none;

  font-size: 14px;
  font-family: var(--main-font);
  background: var(--main-bg-color);
  color: var(--font-color);
  margin-right: 10px;
  border-radius: 20px;

  &:hover, &:focus {
    outline: none;
  }
`;

const Duration = styled.div`
  padding: 0 .8rem;
  color: var(--font-color);
`;


type TimerButtonProps = {
  isRunning: boolean;
};
const TimerButton = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(${(props: TimerButtonProps) => props.isRunning ? stop : start}) no-repeat;
  background-position: 55% 50%;
  background-size: 38px;
  border: none;
  cursor: pointer;
`;

export default Timer;
