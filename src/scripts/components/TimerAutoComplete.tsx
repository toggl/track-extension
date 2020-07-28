import * as React from 'react';
import styled from '@emotion/styled';
import Fuse from 'fuse.js'
import Highlighter from "react-highlight-words";

import { groupTimeEntriesByDay } from '../lib/groupUtils';
import { label, withDot, withLargeDot } from '../@toggl/style/lib/text';

type TimerAutoComplete= {
  timeEntries: Array<Toggl.TimeEntry>;
  filter: string;
  clients: Array<Toggl.Client>;
};

const FUSE_OPTIONS = {
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.0,
  ignoreLocation: true,
  keys: [ 'description' ]
}

export default function TimerAutocomplete ({ filter, timeEntries, clients }: TimerAutoComplete) {
  const { listEntries, projects }  = groupTimeEntriesByDay(timeEntries)
  const uniqueTimeEntries = listEntries.reduce((latestEntries, entries) => {
    latestEntries.push(entries[0])
    return latestEntries
  }, [])

  const fuseTimeEntries = new Fuse(uniqueTimeEntries, FUSE_OPTIONS)

  const filteredTimeEntries= fuseTimeEntries.search(filter)
  const hasItems = filteredTimeEntries.length > 0

  return hasItems ?
      <Dropdown>
          <TimeEntrySuggestions projects={projects} items={filteredTimeEntries} clients={clients} filter={filter}/>
      </Dropdown>
        : null
}


function TimeEntrySuggestions ({ filter, items, projects, clients }) {
  return (
    <React.Fragment>
        <Label>Previously tracked time entries</Label>
        <Items>
          {
            items && items.map(({ item }) => <Suggestion item={item} project={projects[item.pid]} client={projects[item.pid] && projects[item.pid].cid && clients[projects[item.pid].cid]} filter={filter} />)
          }
        </Items>
    </React.Fragment>
  )
}

function Suggestion ({ item, project, filter, client }) {
  return (
    <Entry>
      <Highlighter highlightStyle={{backgroundColor: 'rgba(0,0,0,0.06)'}} searchWords={[filter]} textToHighlight={item.description} />
      { project && <Project color={project.hex_color}>{project.name}</Project>}
      { client && <Client>{client.name}</Client>}
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
