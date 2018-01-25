/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('a.card', {observe: true}, function (elem) {
  var btnClass = 'toggl-start-btn';
  var link = elem.querySelector('.' + btnClass);

  if (link) {
    link.innerText = '';
    return;
  }

  var description = Array.from(elem.querySelectorAll('.title-text')).map(function(item) {
    return item.textContent;
  }).join('');

  var project = document.querySelector('.project-selector-caret').textContent;

  link = togglbutton.createTimerLink({
    className: btnClass,
    description: description,
    projectName: project
  });
  link.innerText = '';
  link.addEventListener('mousedown', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  elem.insertBefore(link, elem.querySelector('.card-text-section'));
});
