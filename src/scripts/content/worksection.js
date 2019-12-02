'use strict';

// Gets project name from print styles
// They're included on any page as of 2019-12-02 with following structure:
// <div id="header_print">
//   <span>{workspace_name}</span>
//   projectName
// </div>
function getProjectName () {
  const printHeaderElem = document.querySelector('#header_print');

  return printHeaderElem && printHeaderElem.lastChild && printHeaderElem.lastChild.nodeValue
    ? printHeaderElem.lastChild.nodeValue.trim()
    : '';
}

// Task view
togglbutton.render('.task:not(.toggl)', { observe: true }, function (elem) {
  function getDescription () {
    // Task details view
    const descriptionElem = elem.querySelector('h1 > a');
    if (descriptionElem) return descriptionElem.textContent.trim();

    // Task modal view
    const descriptionModalElem = document.querySelector('#TB_title .name a');
    return descriptionModalElem ? descriptionModalElem.textContent.trim() : '';
  }

  const link = togglbutton.createTimerLink({
    className: 'worksection-taskview',
    description: getDescription,
    projectName: getProjectName
  });

  const root = document.querySelector('.buts_menu');
  if (root) {
    root.appendChild(link);
  }
});

// Tasks list
togglbutton.render('#tasks_images .item:not(.toggl)', { observe: true }, function (elem) {
  function getDescription () {
    const descriptionElem = elem.querySelector('.name > a');
    return descriptionElem ? descriptionElem.textContent.trim() : '';
  }

  const link = togglbutton.createTimerLink({
    buttonType: 'minimal',
    className: 'worksection-listview',
    description: getDescription,
    projectName: getProjectName
  });

  const root = elem.querySelector('.td_actions > span');
  if (root) {
    root.appendChild(link);
  }
});
