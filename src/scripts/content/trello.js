/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.window-header:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('div', 'button-link trello-tb-wrapper'),
    //duration,
    descFunc,
    titleElem = $('.window-title h2', elem),
    //trackedContainer = createTag('div', 'toggl-tracked'),
    //trackedElem = $('.other-actions'),
    projectElem = $('.board-header > a'),
    descriptionElem = $('.js-move-card');

  if (!descriptionElem) {
    return;
  }

  descFunc = function () {
    return titleElem.textContent;
  };

  link = togglbutton.createTimerLink({
    className: 'trello',
    description: descFunc,
    projectName: projectElem.textContent,
    calculateTotal: true
  });

  container.appendChild(link);
  descriptionElem.parentNode.insertBefore(container, descriptionElem);

  // Add Tracked time text
  /*
  duration = togglbutton.calculateTrackedTime(titleElem.textContent);
  h3 = document.createElement("h3");
  h3.textContent = "Time tracked";

  p = document.createElement("p");
  p.setAttribute("title", "Time tracked with Toggl: " + duration);
  p.textContent = duration;

  trackedContainer.appendChild(h3);
  trackedContainer.appendChild(p);
  trackedElem.parentNode.insertBefore(trackedContainer, trackedElem);
  */
}, "window-wrapper");

/* Checklist buttons */
togglbutton.render('.checklist-item-details:not(.toggl)', {observe: true}, function (elem) {
  var link,
    projectElem = $('.board-header > a'),
    titleElem = $('.window-title h2'),
    taskElem = $('.checklist-item-details-text', elem);

  link = togglbutton.createTimerLink({
    className: 'trello',
    buttonType: 'minimal',
    projectName: projectElem.textContent,
    description: titleElem.textContent + ' - ' + taskElem.textContent,
  });

  link.classList.add('checklist-item-button');
  elem.parentNode.appendChild(link);
}, "window-wrapper");
