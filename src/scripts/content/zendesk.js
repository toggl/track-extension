/*jslint indent: 2 */
/*global $: false, document: false, location: false, togglbutton: false*/

'use strict';

togglbutton.render('.pane_header:not(.toggl)', {observe: true}, function (elem) {
  var link, titleFunc, description,
    projectName = $('title').textContent,
    divTag = document.createElement("div");

  titleFunc = function () {
    var titleElem = $('.selected .tab_text'),
      ticketNum = location.href.match(/tickets\/(\d+)/);

    if (titleElem !== null) {
      description = titleElem.innerText;
    }

    if (ticketNum) {
      description = '#' + ticketNum[1] + " " + description;
    }
    return description;
  };

  link = togglbutton.createTimerLink({
    className: 'zendesk',
    description: titleFunc,
    projectName: projectName && projectName.split(' - ').shift()
  });

  divTag.appendChild(link);
  elem.insertBefore(divTag, elem.querySelector(".btn-group"));
});
