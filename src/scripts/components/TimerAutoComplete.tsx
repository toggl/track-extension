import * as React from 'react';
import styled from '@emotion/styled';
import Fuse from 'fuse.js'
import Highlighter from "react-highlight-words";

import { groupTimeEntriesByDay } from '../lib/groupUtils';
import { label, withDot, withLargeDot } from '../@toggl/style/lib/text';
import { greyish } from '../@toggl/style/lib/color';

type TimerAutoComplete= {
  timeEntries: Array<Toggl.TimeEntry>;
  filter: string;
  clients: Array<Toggl.Client>;
  tasks: Array<Toggl.Task>;
  projects: object;
};

const FUSE_OPTIONS = {
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.0,
  ignoreLocation: true
}

export default function TimerAutocomplete ({ filter, timeEntries, clients, tasks, projects }: TimerAutoComplete) {
  const { listEntries }  = groupTimeEntriesByDay(timeEntries)
  const uniqueTimeEntries = listEntries.reduce((latestEntries, entries) => {
    latestEntries.push(entries[0])
    return latestEntries
  }, [])

  const fuseTimeEntries = new Fuse(uniqueTimeEntries, { ...FUSE_OPTIONS, keys: ['description'] })
  const fuseProjects = new Fuse(Object.values(projects), { ...FUSE_OPTIONS, keys: ['name'] })
  const fuseTasks = new Fuse(tasks, { ...FUSE_OPTIONS, keys: ['name'] })

  const filteredTimeEntries= fuseTimeEntries.search(filter)
  const filteredProjects = fuseProjects.search(filter)
  const filteredTasks = fuseTasks.search(filter)

  const hasItems = filteredTimeEntries.length > 0 || filteredProjects.length > 0 || filteredTasks.length > 0

  return hasItems ?
      <Dropdown>
          <TimeEntrySuggestions allProjects={projects} filteredProjects={filteredProjects} filteredTimeEntries={filteredTimeEntries} filteredTasks={filteredTasks} clients={clients} filter={filter}/>
      </Dropdown>
        : null
}


function TimeEntrySuggestions ({ filter, filteredTimeEntries, filteredProjects, filteredTasks, allProjects, clients }) {
  return (
    <React.Fragment>
        {filteredTimeEntries.length > 0 &&
          <React.Fragment>
            <Label>Previously tracked time entries</Label>
            <Items>
              {
                filteredTimeEntries.map(({ item: timeEntry }) => <TimeEntrySuggestion key={timeEntry.id} timeEntry={timeEntry} project={allProjects[timeEntry.pid]} client={allProjects[timeEntry.pid] && allProjects[timeEntry.pid].cid && clients[allProjects[timeEntry.pid].cid]} filter={filter} />)
              }
            </Items>
          </React.Fragment>
        }
        {filteredProjects.length > 0 &&
          <React.Fragment>
            <Label>Projects</Label>
            <Items>
              {
                filteredProjects.map(({ item: project }) => <ProjectSuggestion key={project.id} project={project} filter={filter} client={project.cid && clients[project.cid]} />)
              }
            </Items>
          </React.Fragment>
        }
        {filteredTasks.length > 0 &&
          <React.Fragment>
            <Label>Task</Label>
            <Items>
              {
                filteredTasks.map(({ item: task }) => <TaskSuggestion key={task.id} task={task} project={allProjects[task.pid]} filter={filter} />)
              }
            </Items>
          </React.Fragment>
        }
    </React.Fragment>
  )
}

function TimeEntrySuggestion ({ timeEntry, project, filter, client }) {
  return (
    <Entry>
      <Highlighter highlightStyle={{backgroundColor: 'rgba(0,0,0,0.06)'}} searchWords={[filter]} textToHighlight={timeEntry.description} />
      { project && <Project color={project.hex_color}>{project.name}</Project>}
      { client && <Client>{client.name}</Client>}
    </Entry>
  )
}

function ProjectSuggestion({ project, filter, client }) {
  return (
    <Entry>
      <Project color={project.hex_color}>
        <Highlighter highlightStyle={{backgroundColor: 'rgba(0,0,0,0.06)'}} searchWords={[filter]} textToHighlight={project.name} />
      </Project>
      { client && <Client>{client.name}</Client>}
    </Entry>
  )
}

function TaskSuggestion({ task, project, filter }) {
  return (
    <Entry>
      <Task>
        <Highlighter highlightStyle={{backgroundColor: 'rgba(0,0,0,0.06)'}} searchWords={[filter]} textToHighlight={task.name} />
      </Task>
      <Project color={project.hex_color}>{project.name}</Project>
    </Entry>
  )
}

const Label = styled.div`
  ${label}
  padding: 10px;
`

const Entry = styled.li`
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 30px;
`

const Project = styled.span`
  ${withLargeDot}
  display: flex;
  align-items: center;
  color: ${({ color }) => color};

  &:before {
    color: ${({ color }) => color};
  }
`

const Client = styled.span`
  ${withDot}
`

const Task = styled.span`
  color: ${greyish};
`

const Dropdown = styled.div`
  position: absolute;
  top: 55px;
  z-index: 1000;
  height: auto;
  width: 100%;
  margin: 0 8px;
  padding: 5px;

  border-radius: 8px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,.1);
  border: 1px solid rgba(0,0,0,.1);

  overflow: auto;
  background: var(--base-color);
  color: var(--font-color);
`

const Items = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`
