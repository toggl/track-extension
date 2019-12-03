import browser from 'webextension-polyfill';
import { isSameDay } from 'date-fns';

const getProject = (entry: Toggl.TimeEntry) => {
  return browser.extension.getBackgroundPage().TogglButton.findProjectByPid(entry.pid);
}

const hasExistingGroup = (entry: Toggl.TimeEntry) => ([te]: Toggl.TimeEntry[]) => {
  return isSameDay(te.start, entry.start) &&
    te.description === entry.description &&
    te.pid === entry.pid &&
    te.tid === entry.tid &&
    te.wid === entry.wid &&
    (te.tags || []).join(',') === (entry.tags || []).join(',') &&
    te.billable === entry.billable;
};

export const groupTimeEntriesByDay = (timeEntries: Toggl.TimeEntry[]) => {
  const { listEntries, projects } = [...timeEntries].reverse().reduce((sum, entry) => {
    // Exclude running TE.
    if (entry.duration < 0) {
      return sum;
    }

    const existingGroupIndex = sum.listEntries.findIndex(hasExistingGroup(entry));
    if (existingGroupIndex === -1) {
      // This TE group has not been seen yet.
      sum.listEntries.push([entry]);
    } else {
      // This TE group already exists.
      sum.listEntries[existingGroupIndex].push(entry);
      sum.listEntries[existingGroupIndex].sort((a, b) => {
        // Most recent entries first.
        if (a.start > b.start) return -1;
        if (b.start > a.start) return 1;
        return 0;
      });
    }

    const project = getProject(entry);
    if (project) sum.projects[project.id] = project;
    return sum;
  }, { listEntries: [], projects: {} } as { listEntries: Toggl.TimeEntry[][], projects: Toggl.ProjectMap });

  return { listEntries, projects };
};
