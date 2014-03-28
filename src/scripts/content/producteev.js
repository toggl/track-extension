/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
/*Created by lancelothk on 2/16/14.*/

"use strict";

togglbutton.render('.td-attributes:not(.toggl)', {observe: true}, function (elem) {
  var link, newDiv,
    taskActive = $('.task.active'),
    titleElem = $('.title > span', taskActive),
    projectElem = $('.project-value', taskActive);

  if (titleElem === null) {
    return;
  }

  link = togglbutton.createTimerLink({
    className: 'producteev',
    description: titleElem.title,
    projectName: projectElem.title
  });

  newDiv = document.createElement('div');
  elem.insertBefore(newDiv.appendChild(link), elem.firstChild);
});
