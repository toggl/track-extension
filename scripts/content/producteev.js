/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
/*Created by lancelothk on 2/16/14.*/

"use strict";

togglbutton.render('.td-attributes:not(.toggl)', {observe: true}, function (elem) {
  var link, newDiv,
    taskActive = document.querySelector('.task.active'),
    titleElem = $('.title > span', taskActive),
    projectElem = $('.project-value', taskActive),
    container = elem;//$('.td-attributes', elem);

  debugger;
  if (titleElem === null || container === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'producteev',
    description: titleElem.title,
    projectName: projectElem.title
  });

  newDiv = document.createElement('div');
  newDiv.innerHTML = '&nbsp;&nbsp;&nbsp;';
  newDiv.appendChild(link);
  container.insertBefore(newDiv, container.firstChild);
});
