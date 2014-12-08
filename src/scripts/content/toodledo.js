/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

'use strict';

togglbutton.render('.row:not(.toggl)', {observe: true}, function (elem) {
  var link,
    newElem,
    landmarkElem,
    taskElem = $('.task', elem),
    goalElem = $('.col1024', elem),
    folderElem = $('.col1', elem),
    folderName = folderElem && folderElem.firstChild.textContent;

  folderName = (!folderName || folderName === "No Folder") ? "" : " - " + folderName;

  link = togglbutton.createTimerLink({
    className: 'toodledo',
    buttonType: 'minimal',
    description: taskElem.textContent + folderName,
    projectName: goalElem && goalElem.textContent
  });

  newElem = document.createElement('div');
  newElem.appendChild(link);
  newElem.setAttribute('style', 'float:left;width:30px;height:20px;');

  landmarkElem = $('.subm', elem) || $('.subp', elem) || $('.ax', elem);
  elem.insertBefore(newElem, landmarkElem.nextSibling);
});
