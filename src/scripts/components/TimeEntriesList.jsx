import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import BillableIcon from './BillableIcon.jsx';
import TagsIcon from './TagsIcon.jsx';
import { ProjectLargeDot } from '../@toggl/ui/icons/index';
import * as color from '../@toggl/style/lib/color';
import play from './play.svg';

const NO_DESCRIPTION = '(no description)';

export default function TimeEntriesList ({ timeEntries = [], projects = {} }) {
  return (
    <div>
      <p>Recent entries</p>
      <EntryList>
        {timeEntries.map((timeEntry, i) => {
          const project = projects[timeEntry.pid] || null;
          return <TimeEntriesListItem key={`te-${i}`} timeEntry={timeEntry} project={project} dataId={i} />;
        })}
      </EntryList>
    </div>
  );
}
TimeEntriesList.propTypes = {
  timeEntries: PropTypes.array,
  projects: PropTypes.object
};

const EntryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  font-family: Roboto, Helvetica, Arial, sans-serif;
`;
const EntryItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding-left: 20px;
  height: 40px;

  color: ${color.lightGrey};
  font-size: 14px;
  box-shadow: rgb(232, 232, 232) 0px -1px 0px 0px inset;

  &:hover {
    background-color: ${color.listItemHover};
  }

  &:last-child {
    box-shadow: none;
  }

  > div {
    flex: 1;
  }
`;

const EntryIcons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function TimeEntriesListItem ({ timeEntry, project, ...props }) {
  const description = timeEntry.description || NO_DESCRIPTION;

  const hasTags = timeEntry.tags && timeEntry.tags.length;
  const isBillable = !!timeEntry.billable;
  const tags = hasTags ? timeEntry.tags.join(', ') : '';

  return (
    <EntryItem data-id={props.dataId}>
      <TimeEntryDescription title={description}>{description}</TimeEntryDescription>

      <TimeEntryProject timeEntry={timeEntry} project={project} />

      <EntryIcons>
        {hasTags && <TagsIcon title={tags} />}
        <BillableIcon active={isBillable} />
        <ContinueButton data-continue-id={timeEntry.id} title='Continue this entry' />
      </EntryIcons>
    </EntryItem>
  );
}
TimeEntriesListItem.propTypes = {
  timeEntry: PropTypes.object,
  project: PropTypes.object,

  dataId: PropTypes.number
};

const TimeEntryDescription = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: text;
  line-height: normal;
  overflow: hidden;
  color: #222;
`;

function TimeEntryProject ({ project }) {
  return (
    <div>
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
  width: 30px;
  height: 30px;
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
