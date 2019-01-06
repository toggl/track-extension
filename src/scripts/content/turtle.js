/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('a.card', {observe: true}, function (elem) {
  const btnClass = 'turtle-toggl-start-btn';
  let link = elem.querySelector('.' + btnClass);

  if (link) {
    link.innerText = '';
    return;
  }

  const description = Array.from(elem.querySelectorAll('.title-text')).map(item => item.textContent).join('');
  const project = document.querySelector('.project-selector-caret').textContent;

  link = togglbutton.createTimerLink({
    className: btnClass,
    description: description,
    projectName: project
  });

  link.innerText = '';

  link.addEventListener('mousedown', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  elem.insertBefore(link, elem.querySelector('.card-text-section'));
});
