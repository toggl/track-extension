import * as React from 'react';
import styled from '@emotion/styled';
import { addSeconds, subSeconds } from 'date-fns';
import * as keycode from 'keycode';

import { formatDuration } from '../@toggl/time-format-utils/format-duration';

import BillableIcon from './BillableIcon';
import ProjectsIcon from './ProjectsIcon';
import { TimeEntryDescription, TimeEntryProject } from './TimeEntriesList';
import TimerAutoComplete from './TimerAutoComplete'
import TagsIcon from './TagsIcon';
import start from '../icons/start.svg';
import stop from '../icons/stop.svg';
import { useDuration } from '../shared/use-duration';

const NO_DESCRIPTION = '(no description)';

type TimerProps = {
  entry: Toggl.TimeEntry | null;
  project: Toggl.Project | null;
  timeEntries: Array<Toggl.TimeEntry> | null;
  clients: Array<Toggl.Client> | null;
  tasks: object | null;
  projects: object | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
};

function Timer (props: TimerProps) {
  return props.entry
    ? <RunningTimer entry={props.entry} project={props.project} />
    : <TimerForm timeEntries={props.timeEntries} clients={props.clients} tasks={props.tasks} projects={props.projects} />
}

function RunningTimer(props: { entry: Toggl.TimeEntry, project: Toggl.Project | null }) {
  const { entry, project } = props;
  const tags = (entry.tags || []).join(', ');

  const editEntry = () => {
    window.PopUp.renderEditForm(entry);
  };

  return (
    <React.Fragment>
      <TimerContainer onClick={editEntry}>
        <RunningTimerDescription>
          <TimeEntryDescription title={`Click to edit ${entry.description || ''}`}>
            {entry.description || NO_DESCRIPTION}
          </TimeEntryDescription>
        </RunningTimerDescription>
        <div>
          <TimerDuration start={entry.start} />
          <TimerButton isRunning onClick={stopTimer} />
        </div>
      </TimerContainer>
      <TimerButtonRowContainer>
        {project &&
          <TimeEntryProject project={project} />
        }
        {tags && <TagsIcon title={tags} />}
      </TimerButtonRowContainer>
    </React.Fragment>
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

function StoppedTimerDuration ({ secs }: { secs: number }) {
  return (
    <Duration isPlaceholder={secs == 0}>
      {formatDuration(subSeconds(new Date(), secs))}
    </Duration>
  )
}

function TimerForm ({ timeEntries, clients, projects, tasks }) {
  const [isDropdownOpen, setIsDropdown] = React.useState(false)
  const [description, setDescription] = React.useState('')
  const [duration, setDuration] = React.useState(0)
  const [selectedProject, setSelectedProject] = React.useState(null)
  const [selectedTags, setSelectedTags] = React.useState([])
  const [selectedBillable, setSelectedBillable] = React.useState(false)

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const taskList = React.useMemo(() => tasks.flat(), tasks)

  const startTimer = (e) => {
    e.preventDefault();
    window.PopUp.sendMessage({ type: 'timeEntry', description, service: 'dropdown', respond: true });
  };
  const onKeyUp = (e) => {
    if (keycode(e.which) === 'enter') {
      startTimer(e);
    }

    if(isDropdownOpen && keycode(e.which) === 'down') {
      dropdownRef.current && dropdownRef.current.focus()
    }
  }

  const onChange = (e) => {
    setDescription(e.target.value)
    setIsDropdown(!!description)
  }

  const onSelectSuggestion = (timeEntry) => {
    setIsDropdown(false)
    setDescription(timeEntry.description)
  }

  return (
    <React.Fragment>
      <TimerContainer>
        <TimerInput value={description} onKeyUp={onKeyUp} onChange={onChange} placeholder='What are you working on?' />
        <div>
          <StoppedTimerDuration secs={duration} />
          <TimerButton isRunning={false} onClick={startTimer} />
        </div>
      </TimerContainer>
      {isDropdownOpen &&
        <TimerAutoComplete dropdownRef={dropdownRef} onSelect={onSelectSuggestion} filter={description.trim()} timeEntries={timeEntries} clients={clients} tasks={taskList} projects={projects} />
      }
      <TimerButtonRowContainer>
        {selectedProject ? <TimeEntryProject project={selectedProject} /> : <SmallTimerButton><ProjectsIcon small /></SmallTimerButton>}
        <SmallTimerButton><TagsIcon small title={selectedTags.join(', ')} /></SmallTimerButton>
        <SmallTimerButton><BillableIcon active small /></SmallTimerButton>
      </TimerButtonRowContainer>
    </React.Fragment>
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
  height: 51px;

  padding: 15px 15px 0px 15px;

  cursor: pointer;
  font-size: 14px;
  background: var(--base-color);

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

const TimerButtonRowContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 45px;

  padding: 10px 15px;

  font-size: 14px;
  box-shadow: var(--border-color) 0px -1px 0px 0px inset;
  background: var(--base-color);
`;

const RunningTimerDescription = styled.div`
  margin-left: 10px;
`

const TimerInput = styled.input`
  flex: 1;
  height: 36px;
  border: none;

  font-size: 16px;
  font-family: var(--main-font);
  background: var(--main-bg-color);
  color: var(--font-color);
  margin-right: 10px;

  &:hover, &:focus {
    outline: none;
  }
`;

type DurationProps = {
  isPlaceholder?: boolean;
};

const Duration = styled.div`
  color: ${(props: DurationProps) => props.isPlaceholder ? 'var(--summary-font-color)' : 'var(--font-color)'};
  font-size: 16px;
  margin-right: 20px;
`;

type TimerButtonProps = {
  isRunning: boolean;
};

const TimerButton = styled.div`
  display: inline-block;
  width: 36px;
  height: 36px;
  background: url(${(props: TimerButtonProps) => props.isRunning ? stop : start}) no-repeat;
  background-position: 55% 50%;
  background-size: 36px;
  border: none;
  cursor: pointer;
`;

const SmallTimerButton = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  padding-right: 5px;
`

export default Timer;
