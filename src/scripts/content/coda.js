'use strict';

// over all rows rendered in coda
togglbutton.render('.kr-row:not(.toggl)', { observe: true }, function (elem) {
  // prevent rendering on temporary rows
  if (elem.getElementsByClassName('toggl-wrapper').length > 0) return;

  // fetch the row data
  const row = {
    object_id: elem.getAttribute('data-object-id'),
    id: elem.getAttribute('data-row-id'),
    cells: Array.from(elem.childNodes).map(cell => {
      const id = cell.getAttribute('data-column-id');
      const columnSelector = 'div[data-column-id=' + id + ']';
      const column = document.querySelector(columnSelector);

      return {
        id,
        cell,
        column,
        title: column && column.textContent,
        text: cell.textContent
      };
    })
  };

  // look for features of a task
  const task = row.cells.findIndex(cell => cell.title === 'Task');
  const project = row.cells.findIndex(cell => cell.title === 'Project');
  const isTask = task > 0;

  // ignore anything thats not a task
  if (!isTask) return;

  // build the button
  const link = togglbutton.createTimerLink(
    Object.assign(
      {
        className: 'coda',
        buttonType: 'minimal',
        description: row.cells[task].text + ' -- ' + row.cells[task].id
      },
      project > 0 && {
        projectName: row.cells[project].text
      }
    )
  );

  // style it for coda
  const wrapper = document.createElement('div');
  wrapper.className = 'toggl-wrapper';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.justifyContent = 'center';
  wrapper.appendChild(link);

  // add it to the end of the task
  elem.appendChild(wrapper);
});
