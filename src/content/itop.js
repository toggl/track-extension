'use strict';

// Main function
togglbutton.render(
  // Specify selector for element button needs to hook into
  // Make sure to include :not(.toggl) to avoid duplicates
  '.ibo-object-details[data-object-class="Incident"] .ibo-panel--header .ibo-panel--header-left .ibo-panel--titles .ibo-panel--title:not(.toggl),.ibo-object-details[data-object-class="Problem"] .ibo-panel--header .ibo-panel--header-left .ibo-panel--titles .ibo-panel--title:not(.toggl),.ibo-object-details[data-object-class="UserRequest"] .ibo-panel--header .ibo-panel--header-left .ibo-panel--titles .ibo-panel--title:not(.toggl)',
  { observe: true },
  function (elem) {
    // Create timer link element
    const link = togglbutton.createTimerLink({
      description: getTitle(elem),
      projectName: 'My Project',
      tags: [getTitle(elem)]
    });
    // You can also pass function to description, projectName, and tags arguments

    // Add Space
    elem.appendChild(document.createTextNode (" "));
    // Add link to element
    elem.appendChild(link);
  }
);

function getTitle (parent) {
  //const el = parent.querySelector('.title');
  return getIncident(parent) + ' - ' + $('.ibo-field[data-attribute-code="title"] .ibo-field--value').textContent.trim();
}

function getIncident(parent) {
  return parent ? parent.textContent.trim() : '';
}