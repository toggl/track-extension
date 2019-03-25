import React from 'react';
import PropTypes from 'prop-types';

const NO_DESCRIPTION = '(no description)';

export default function TimeEntriesList ({ timeEntries = [], projects = {} }) {
  return (
    <div>
      <p>Recent entries</p>
      <ul>
        {timeEntries.map((timeEntry, i) => {
          const project = projects[timeEntry.pid] || null;
          return <TimeEntriesListItem timeEntry={timeEntry} project={project} dataId={i} />;
        })}
      </ul>
    </div>
  );
}
TimeEntriesList.propTypes = {
  timeEntries: PropTypes.array,
  projects: PropTypes.object
};

function TimeEntriesListItem ({ timeEntry, project, ...props }) {
  return (
    <li data-id={props.dataId}>
      <div className="te-desc" title={timeEntry.description}>
        {timeEntry.description || NO_DESCRIPTION}
      </div>

      {project && <TimeEntryProject timeEntry={timeEntry} project={project} />}

      <ContinueButton />

      <TimeEntryIcons timeEntry={timeEntry} />

    </li>
  );
}
TimeEntriesListItem.propTypes = {
  timeEntry: PropTypes.object,
  project: PropTypes.object,

  dataId: PropTypes.string
};

function TimeEntryProject ({ project }) {
  return (
    <div className="te-proj">
      <div className='tb-project-bullet tb-project-color' style={{ backgroundColor: project.hex_color }}>
        <span>{project.name}</span>
      </div>
    </div>
  );
}
TimeEntryProject.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    hex_color: PropTypes.string
  })
};

function ContinueButton () {
  return (
    <div className="te-continue">
      Continue
    </div>
  );
}

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
