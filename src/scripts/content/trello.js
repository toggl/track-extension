/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag:false*/

'use strict';

togglbutton.render('.window-header:not(.toggl)', {observe: true}, function (elem) {
  var link, container = createTag('div', 'card-detail-item clear'),
    titleElem = $('.window-title-text', elem),
    projectElem = $('.board-header > a'),
    descriptionElem = $('.card-detail-item-block');

  link = togglbutton.createTimerLink({
    className: 'trello',
    description: titleElem.innerText,
    projectName: projectElem.innerText,
    tags: getTrelloLabels()
});

  container.appendChild(link);
  descriptionElem.parentNode.insertBefore(container, descriptionElem);
});

/* Checklist buttons */
togglbutton.render('.checklist-item-details:not(.toggl)', {observe: true}, function (elem) {
  var link,
    projectElem = $('.board-header > a'),
    titleElem = $('.window-title-text'),
    taskElem = $('.checklist-item-details-text', elem);

  link = togglbutton.createTimerLink({
    className: 'trello',
    buttonType: 'minimal',
    projectName: projectElem.innerText,
    description: titleElem.innerText + ' - ' + taskElem.innerText,
    tags: getTrelloLabels()
  });

  link.classList.add('checklist-item-button');
  elem.parentNode.appendChild(link);
});

function getTrelloLabels() {
    var labels = [];
    var label = null;
    var labelElements = document.querySelectorAll('.js-card-detail-labels-list span.card-label');
    for (var i = 0; i < labelElements.length; i++) {
        label = labelElements[i].innerText;
        if (label.trim().length > 0)
            labels.push(label);
    }

    return labels;
}