import * as React from 'react';
import Fuse from 'fuse.js';

import { groupTimeEntriesByDay } from '../lib/groupUtils';

const FUSE_OPTIONS = {
  minMatchCharLength: 2,
  threshold: 0.0,
  ignoreLocation: true
};

const initialState = {
  currentDropdown: 'none',
  timeEntries: [],
  projects: [],
  tasks: []
};

function reducer (state, action) {
  switch (action.type) {
    case 'SET_FILTERED_ITEMS':
      return {
        ...state,
        timeEntries: action.payload.timeEntries,
        projects: action.payload.projects,
        tasks: action.payload.tasks
      };
    case 'SET_CURRENT_DROPDOWN':
      return {
        ...state,
        currentDropdown: action.payload
      };
  }
}

export function useAutoComplete (filter, timeEntries, projects, tasks) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const { listEntries } = groupTimeEntriesByDay(timeEntries);
    const uniqueTimeEntries = listEntries.reduce((latestEntries, entries) => {
      latestEntries.push(entries[0]);
      return latestEntries;
    }, []);

    const fuseTimeEntries = new Fuse(uniqueTimeEntries, { ...FUSE_OPTIONS, keys: ['description'] });
    const fuseProjects = new Fuse(Object.values(projects), { ...FUSE_OPTIONS, keys: ['name'] });
    const fuseTasks = new Fuse(tasks, { ...FUSE_OPTIONS, keys: ['name'] });

    dispatch({
      type: 'SET_FILTERED_ITEMS',
      payload: {
        timeEntries: fuseTimeEntries.search(filter),
        projects: fuseProjects.search(filter),
        tasks: fuseTasks.search(filter)
      }
    });
  }, [filter, projects, tasks, timeEntries]);

  React.useEffect(() => {
    const project = filter.match(/@\w+/);
    const tag = filter.match(/#\w+/);

    dispatch({
      type: 'SET_CURRENT_DROPDOWN',
      payload: filter.length <= 2 && 'none' || project && project[0] && 'project' || tag && tag[0] && 'tag' || 'main'
    });
  }, [filter]);

  return {
    suggestions: {
      timeEntries: state.timeEntries,
      projects: state.projects,
      tasks: state.tasks
    },
    currentDropdown: state.currentDropdown
  };
}
