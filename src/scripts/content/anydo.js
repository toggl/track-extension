/*jslint indent: 2 */
/*global $: false, togglbutton: false, createTag:false, document: false*/

'use strict';

togglbutton.render('.dialog:not(.toggl)', {observe: true}, function (elem) {
  var link, wrap = createTag('div'),
    container = $('#top-level-details', elem),
    projectElem = $('.folderSelector', elem),
    titleFunc;

  titleFunc = function () {
    return document.querySelector('#title', elem).textContent;
  };

  link = togglbutton.createTimerLink({
    className: 'anydo',
    description: titleFunc,
    projectName: projectElem.textContent
  });

  wrap.appendChild(link);
  container.appendChild(wrap);
});


/* Subtasks */

togglbutton.render('.subtasks-list li .container:not(.toggl)', {observe: true}, function (elem) {
  var link, wrap = createTag('div'),
    projectElem = $('.folderSelector'),
    titleFunc;

  titleFunc = function () {
    return $('.title', elem).textContent;
  };

  link = togglbutton.createTimerLink({
    className: 'anydo',
    description: titleFunc,
    projectName: projectElem.textContent
  });

  wrap.appendChild(link);
  elem.insertBefore(wrap, $('.controls', elem));
});

