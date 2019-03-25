import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { ProjectLargeDot } from '../@toggl/ui/icons/index';

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
`;
const EntryItem = styled.li`
  display: flex;
  flex-direction: row;

  > * {
    flex: 1;
  }
`;

function TimeEntriesListItem ({ timeEntry, project, ...props }) {
  return (
    <EntryItem data-id={props.dataId}>
      <div className="te-desc" title={timeEntry.description}>
        {timeEntry.description || NO_DESCRIPTION}
      </div>

      {project && <TimeEntryProject timeEntry={timeEntry} project={project} />}

      <ContinueButton />

      <TimeEntryIcons timeEntry={timeEntry} />

    </EntryItem>
  );
}
TimeEntriesListItem.propTypes = {
  timeEntry: PropTypes.object,
  project: PropTypes.object,

  dataId: PropTypes.string
};

function TimeEntryProject ({ project }) {
  return (
    <ProjectLargeDot color={project.hex_color }>
      <span>{project.name}</span>
    </ProjectLargeDot>
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
  cursor: pointer;
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zd…AgMmwtOS42IDZjLS45LjUtMS43LjEtMS43LTFWMnoiIGZpbGw9IiM2ZjZmNmYiLz48L3N2Zz4=) 55% 50% / 14px no-repeat;
  background-position: 55% 50%;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial
`;

function TimeEntryIcons ({ timeEntry }) {
  const hasTags = timeEntry.tags && timeEntry.tags.length;
  const isBillable = !!timeEntry.billable;
  const tags = hasTags ? timeEntry.tags.join(', ') : '';

  const iconClasses = `${hasTags && 'tag-icon-visible'} ${isBillable && 'billable-icon-visible'}`

  return (
    <div className={`te-icons ${iconClasses}`}>
      <div className="tag-icon" title={tags} />
      <div className="billable-icon" title='billable' />
    </div>
  );
}
TimeEntryIcons.propTypes = {
  timeEntry: PropTypes.shape({
    tags: PropTypes.array,
    billable: PropTypes.bool
  })
};
