/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

const join = (elements) => {
  return Array.from(elements).map(item => item.textContent).join('')
};

const getDescription = (element) => {
  const currentTitleNodes = element
    .querySelectorAll('.title-text');

  if (!element.closest('.card-node').parentElement.closest('.card-node')) {
    return join(currentTitleNodes);
  }

  const sectionTitleNodes = element
    .closest('.card-node')
    .parentElement
    .closest('.card-node')
    .querySelector('a:first-child .wrap-with-text')
    .querySelectorAll('.title-text');

  return `${join(sectionTitleNodes)} – ${join(currentTitleNodes)}`;
};

const getProject = (element) => {
  return document.querySelector('.project-selector-caret').textContent;
};

togglbutton.render('.card-list-wrapper .card-node:not(.toggl)', { observe: true }, (element) => {
  const btnClass = 'turtle-toggl-start-btn';

  const description = getDescription(element);
  const project = getProject(element);

  const link = togglbutton.createTimerLink({
    className: btnClass,
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  link.addEventListener('mousedown', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  element.querySelector('a.card').insertBefore(link, element.querySelector('.card-text-section'));
});
