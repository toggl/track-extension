import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import BillableIcon from './BillableIcon.jsx';
import TagsIcon from './TagsIcon.jsx';
import { ProjectLargeDot } from '../@toggl/ui/icons/index';
import * as color from '../@toggl/style/lib/color';
import play from './play.svg';

const NO_DESCRIPTION = '(no description)';

const secToDecimalHours = (secs) => (secs / 60 / 60).toFixed(2) + ' h'

export default function TimeEntriesList ({ timeEntries = [], projects = {} }) {
  return (
    <EntryList>
      {timeEntries.map((timeEntry, i) => {
        const project = projects[timeEntry.pid] || null;
        return <TimeEntriesListItem key={`te-${i}`} timeEntry={timeEntry} project={project} dataId={i} />;
      })}
    </EntryList>
  );
}
TimeEntriesList.propTypes = {
  timeEntries: PropTypes.array,
  projects: PropTypes.object
};

function TimeEntriesListItem ({ timeEntry, project, ...props }) {
  const description = timeEntry.description || NO_DESCRIPTION;
  const hasTags = timeEntry.tags && timeEntry.tags.length;
  const isBillable = !!timeEntry.billable;
  const tags = hasTags ? timeEntry.tags.join(', ') : '';

  return (
    <EntryItem data-id={props.dataId}>
      <EntryItemRow>
        <TimeEntryDescription title={description}>{description}</TimeEntryDescription>
        <EntryIcons>
          <BillableIcon active={isBillable} />
          {hasTags && <TagsIcon title={tags} />}
          <TimeEntryDuration duration={timeEntry.duration} />
        </EntryIcons>
      </EntryItemRow>
      <EntryItemRow>
        <TimeEntryProject timeEntry={timeEntry} project={project} />
        <ContinueButton data-continue-id={timeEntry.id} title='Continue this entry' />
      </EntryItemRow>
    </EntryItem>
  );
}

TimeEntriesListItem.propTypes = {
  timeEntry: PropTypes.object,
  project: PropTypes.object,

  dataId: PropTypes.number
};

function TimeEntryDuration (props) {
  if (!props.duration || props.duration < 0) return null;
  return (
    <div>
      {secToDecimalHours(props.duration)}
    </div>
  );
}
TimeEntryDuration.propTypes = {
  duration: PropTypes.number
};

const TimeEntryDescription = styled.div`
  flex: 1;

  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: text;
  line-height: normal;
  overflow: hidden;
  color: #222;
`;

function TimeEntryProject ({ project }) {
  return (
    <div style={{ flex: 1 }}>
      {project &&
        <ProjectLargeDot color={project.hex_color}>
          <span>{project.name}</span>
        </ProjectLargeDot>
      }
    </div>
  );
}
TimeEntryProject.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    hex_color: PropTypes.string
  })
};

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

const EntryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  border-top: 1px rgb(232, 232, 232) solid;

  font-family: Roboto, Helvetica, Arial, sans-serif;
`;
const EntryItem = styled.li`
  display: flex;
  flex-direction: column;

  // padding-left: 20px;
  padding: .5rem;
  height: 50px;

  color: ${color.lightGrey};
  font-size: 14px;
  box-shadow: rgb(232, 232, 232) 0px -1px 0px 0px inset;

  &:hover {
    background-color: ${color.listItemHover};
  }

  &:last-child {
    box-shadow: none;
  }
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
