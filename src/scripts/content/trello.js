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
  trackedContainer.innerHTML = "<h3>Time tracked</h3><p title='Time tracked with Toggl: " + duration + "'>" + duration + "</p>";
  trackedElem.parentNode.insertBefore(trackedContainer, trackedElem);
  */
});

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
});
