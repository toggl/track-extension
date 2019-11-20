import * as React from 'react';
import styled from '@emotion/styled';
import { format, isSameDay, subSeconds } from 'date-fns';

import BillableIcon from './BillableIcon';
import TagsIcon from './TagsIcon';

import { ProjectLargeDot } from '../@toggl/ui/icons';
import { Button } from '../@toggl/ui/buttons';

import * as color from '../@toggl/style/lib/color';
import * as text from '../@toggl/style/lib/text';
import { borderRadius } from '../@toggl/style/lib/variables';

import { formatDuration } from './Timer';
import play from '../icons/play.svg';

const NO_DESCRIPTION = '(no description)';

const getTimeEntryDayGroups = (timeEntries: Array<Array<Toggl.TimeEntry>>): {[date: string]: Array<Array<Toggl.TimeEntry>>} => {
  return [...timeEntries]
    .sort((a, b) => {
      // Most recent entries first.
      if (a[0].start > b[0].start) return -1;
      if (b[0].start > a[0].start) return 1;
      return 0;
    })
    .filter((timeEntries) => timeEntries.some((te) => te.duration >= 0))
    .reduce((groups: { [date: string]: Array<Array<Toggl.TimeEntry>> }, entries) => {
      const date = format(entries[0].start, 'YYYY-MM-DD');
      groups[date] = groups[date] || [];
      groups[date].push(entries);

      return groups;
    }, {})
};

const TimeEntriesFooter = () => (
  <Footer>
    <a target="_blank" href="https://toggl.com/app/timer?utm_source=toggl-button&utm_medium=referral">
      <Button>
        See more on <strong>toggl.com</strong>
      </Button>
    </a>
  </Footer>);

interface TimeEntriesListProps {
  timeEntries: Toggl.TimeEntry[][];
  projects: IdMap<Toggl.Project>;
};
export default function TimeEntriesList (props: TimeEntriesListProps) {
  const { timeEntries = [], projects = {} } = props;

  if (timeEntries.length === 0) {
    return (
      <Container>
        <div />
        <NoEntries>
          <img src="../../images/stopwatch.png" width="177px" height="179px" />
          <Description>
            Get ready to track time and boost your productivity!
          </Description>
        </NoEntries>
        <TimeEntriesFooter/>
      </Container>);
  }

  const dayGroups = getTimeEntryDayGroups(timeEntries);

  return (
    <Container>
      <EntryList>
        {Object.keys(dayGroups).map((date, groupIndex) => {
          const groupEntries = dayGroups[date];
          const showHeading = !isSameDay(date, Date.now());

          return [
            showHeading && <EntryHeading key={`tegroup-${groupIndex}`}>{format(date, 'ddd, D MMM')}</EntryHeading>,
            ...groupEntries.map((timeEntries, i) => {
              const project = timeEntries[0].pid && projects[timeEntries[0].pid] || null;
              return <TimeEntriesListItem key={`te-${groupIndex}-${i}`} timeEntries={timeEntries} project={project} />;
            })
          ]
        })}
      </EntryList>
      <TimeEntriesFooter/>
    </Container>
  );
}

type TimeEntriesListItemProps = {
  timeEntries: Array<Toggl.TimeEntry>;
  project: Toggl.Project | null;
};
function TimeEntriesListItem ({ timeEntries, project }: TimeEntriesListItemProps) {
  const [isGroupCollapsed, setGroupCollapsed] = React.useState(true)
  const timeEntry = timeEntries[0];

  const totalDuration = timeEntries.reduce((sum, entry) => {
    if (entry.duration > 0) sum += entry.duration;
    return sum;
  }, 0);
  const entriesCount = timeEntries.length;
  const earliestStartTime = format(timeEntries[timeEntries.length - 1].start, 'HH:mm');
  const isGrouped = entriesCount > 1 && isGroupCollapsed;
  const toggleGrouping = React.useCallback(
    () => setGroupCollapsed(val => !val),
    [setGroupCollapsed]
  );

  const content = [
    entriesCount > 1 && (
      <TimeEntryRow
        renderHeader
        key={`grouped-${timeEntry.id}`}
        timeEntry={timeEntry}
        onRowClick={toggleGrouping}
        project={project}
        entriesCount={entriesCount}
        earliestStartTime={earliestStartTime}
        totalDuration={totalDuration}
      />
    )
  ].concat(
    (!isGrouped ? timeEntries : []).map(timeEntry => (
      <TimeEntryRow
        renderHeader={false}
        key={timeEntry.id}
        timeEntry={timeEntry}
        onRowClick={editEntry(timeEntry)}
        project={project}
      />
    ))
  );

  return (
    <React.Fragment>
      {content}
    </React.Fragment>
  );
}

function TimeEntryRow ({
  timeEntry,
  onRowClick,
  project,
  renderHeader,
  entriesCount,
  earliestStartTime,
  totalDuration
}: {
  timeEntry: Toggl.TimeEntry,
  onRowClick: (event: React.MouseEvent) => void,
  project: Toggl.Project | null,
  renderHeader: boolean,
  entriesCount?: number,
  earliestStartTime?: string,
  totalDuration?: number,
}) {

  const description = timeEntry.description || NO_DESCRIPTION;
  const isBillable = !!timeEntry.billable;
  const tags = (timeEntry.tags && timeEntry.tags.length > 0)
    ? timeEntry.tags.join(', ')
    : '';

  return (
    <EntryItem onClick={onRowClick}>
      <EntryItemRow>
        {renderHeader && entriesCount && earliestStartTime &&
          <GroupedEntryCounter title={`${entriesCount} entries since ${earliestStartTime}`}>{entriesCount}</GroupedEntryCounter>
        }
        <TimeEntryDescription title={description}>{description}</TimeEntryDescription>
        <EntryIcons>
          <BillableIcon active={isBillable} />
          {tags && <TagsIcon title={tags} />}
          <TimeEntryDuration duration={totalDuration || timeEntry.duration} />
        </EntryIcons>
      </EntryItemRow>
      <EntryItemRow>
        <TimeEntryProject project={project} />
        <ContinueButton data-continue-id={timeEntry.id} title='Continue this entry' />
      </EntryItemRow>
    </EntryItem>
  )
}

const editEntry = (timeEntry: Toggl.TimeEntry) => (e: React.MouseEvent) => {
  e.preventDefault();
  window.PopUp.renderEditForm(timeEntry);
};

const GroupedEntryCounter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-right: 10px;
  flex-shrink: 0;

  height: 30px;
  width: 30px;

  border-radius: ${borderRadius};

  cursor: pointer;
  transition: background ease-in 0.05s, color ease-in 0.05s;

  border: 1px solid ${color.extraLightGrey};
  background-color: ${color.white};
  color: ${color.grey};

  /* Changes from webapp */
  width: 24px;
  height: 24px;
  font-size: 14px;
  cursor: default;
`;

function TimeEntryDuration ({ duration }: { duration: number }) {
  if (!duration || duration < 0) return null;
  const since = subSeconds(Date.now(),  duration).toUTCString();
  return (
    <div>{formatDuration(since)}</div>
  );
}

export const TimeEntryDescription = styled.div`
  flex: 1;

  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 24px;
  overflow: hidden;
  color: #222;
  cursor: ${(props: { running?: boolean }) => props.running ? 'pointer' : 'text'};
`;

export function TimeEntryProject ({ project }: { project: Toggl.Project | null }) {
  return (
    <div style={{ flex: 1, overflow: 'hidden', paddingRight: 10 }}>
      {project &&
        <ProjectLargeDot color={project.hex_color}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {project.name}
          </span>
        </ProjectLargeDot>
      }
    </div>
  );
}

const ContinueButton = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(${play}) no-repeat;
  background-position: 55% 50%;
  background-size: 14px;
  border: none;
  cursor: pointer;
  opacity: 0.5;

  &:hover {
    opacity: 1.0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 410px;
`;

const NoEntries = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Description = styled.p`
  color: #a3a3a3;
  margin-top: 25px;
  font-size: 14px;
`;

const EntryList = styled.ul`
  list-style: none;
  white-space: nowrap;
  padding: 0;
  margin: 0;

  font-family: Roboto, Helvetica, Arial, sans-serif;
`;
const itemPadding = '.5rem .8rem';
const itemShadow = 'rgb(232, 232, 232) 0px -1px 0px 0px inset';
const EntryItem = styled.li`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  padding: ${itemPadding};
  height: 66px;

  color: ${color.grey};
  font-size: 14px;
  box-shadow: ${itemShadow};
  background-color: ${color.white};
  cursor: pointer;

  &:hover {
    background-color: ${color.listItemHover};
  }

  &:last-child {
    box-shadow: none;
  }

  & ~ EntryHeading {
    margin-top: 1rem;
  }
`;

const EntryHeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: ${itemPadding};
  height: 25px;
  color: ${color.black};
  font-weight: ${text.bold};
  box-shadow: ${itemShadow};
`;

const EntryItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  flex: 1;
`;

const EntryIcons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  > * {
    margin: 0 .25rem;
  }
`;

const Footer = styled(EntryHeading)`
  justify-content: center;
  padding: 30px 0;
`;
