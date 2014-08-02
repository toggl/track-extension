/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.taskItem-titleWrapper:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('a', 'myClass'),
    listElem = $('.lists-scroll'),
    titleElem =$('.taskItem-titleWrapper-title',elem),
    projectElem = $('.active',listElem),
    projectTitleElem = $('.title',projectElem);

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
togglbutton.render('.subtask-title:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('div', 'myClass'),
    listElem = $('.lists-scroll'),
    titleElem = $('.title-container'),
    projectElem = $('.active',listElem),
    projectTitleElem = $('.title',projectElem),
    taskElem = $('.display-view',elem);
    

  link = togglbutton.createTimerLink({
    className: 'wunderlist',
    buttonType: 'minimal',
    description: titleElem.innerText + ' - ' + taskElem.innerText,
    projectName: projectTitleElem.innerText 
  });

  container.appendChild(link);
  taskElem.parentNode.insertBefore(link,taskElem);
});


