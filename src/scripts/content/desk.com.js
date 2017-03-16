/*jslint indent: 2 */
/*global $: false, document: false, location: false, togglbutton: false*/

'use strict';

togglbutton.render('.case .content-top-toolbar .controls ul:not(.toggl)', { observe: true }, function (elem) {
  console.log('boom');

  var link, titleFunc, description,
    projectName = document.querySelector('title').textContent,
    liTag = document.createElement("li");

  titleFunc = function () {
    var titleElem = document.querySelector('.content h1.title'),
      ticketNum = location.href.match(/case\/(\d+)/),
      id;

    if (titleElem !== null) {
      description = titleElem.textContent;
    }

    if (ticketNum) {
      id = '#' + ticketNum[1];
    }

    return [id, description];
  };

  link = togglbutton.createTimerLink({
    className: 'desk',
    id: titleFunc()[0],
    description: titleFunc()[1],
    projectName: projectName && projectName.split(': ').shift(),
    buttonType: "minimal"
  });

  liTag.appendChild(link);
  elem.insertBefore(liTag, elem.querySelector(".case .controls.pull-right li.actions"));
});
