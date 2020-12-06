/* jslint indent: 2 */
/* global $: false, document: false, togglbutton: false */

'use strict';

const join = (elements) => {
  return Array.from(elements).map(item => item.textContent).join('');
};

const getDescription = (element) => {
  const currentTitleNodes = $$('.title-text', element);

  const $cardNode = element
    .closest('.card-node')
    .parentElement
    .closest('.card-node');
  if (!$cardNode) {
    return join(currentTitleNodes);
  }

  const $textNode = $('a:first-child .wrap-with-text', $cardNode);
  const sectionTitleNodes = $$('.title-text', $textNode);

  return `${join(sectionTitleNodes)} – ${join(currentTitleNodes)}`;
};

const getProject = () => {
  return $('.project-selector-caret').textContent;
};

togglbutton.render('.card-list-wrapper .card-node:not([data-toggl])', { observe: true }, (element) => {
  const description = getDescription(element);
  const project = getProject();
  const wrapper = document.createElement('div');
  wrapper.classList.add('turtle-toggl-wrapper');

  const link = togglbutton.createTimerLink({
    className: 'turtle-toggl-start-btn',
    description: description,
    projectName: project,
    buttonType: 'minimal'
  });

  link.addEventListener('mousedown', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  wrapper.appendChild(link);
  element.setAttribute('data-toggl', true);
  $('.inline-actions', element).insertBefore(wrapper, $('.more-actions-btn', element));
});
