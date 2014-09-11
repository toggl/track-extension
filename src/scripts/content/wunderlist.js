/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.taskItem-titleWrapper:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('a', 'taskItem-toggl'),
    listElem = $('.lists-scroll'),
    titleElem = $('.taskItem-titleWrapper-title', elem),
    projectElem = $('.active', listElem),
    projectTitleElem = $('.title', projectElem);

  link = togglbutton.createTimerLink({
    className: 'wunderlist',
    buttonType: 'minimal',
    description: titleElem.innerText,
    projectName: projectTitleElem.innerText
  });

  container.appendChild(link);
  elem.insertBefore(container, titleElem);


});

/* Checklist buttons */
togglbutton.render('.subtask:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('span', 'detailItem-toggl small'),
    listElem = $('.lists-scroll'),
    chkBxElem = $('.checkBox', elem),
    titleElem = $('.title-container'),
    projectElem = $('.active', listElem),
    projectTitleElem = $('.title', projectElem),
    taskElem = $('.display-view', elem);

  link = togglbutton.createTimerLink({
    className: 'wunderlist',
    buttonType: 'minimal',
    description: titleElem.innerText + ' - ' + taskElem.innerText,
    projectName: projectTitleElem.innerText
  });

  container.appendChild(link);
  chkBxElem.parentNode.insertBefore(container, chkBxElem);
});