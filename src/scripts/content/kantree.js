'use strict';

/* Features: */
/* - Add timer to the card */
/* - Add timer to the sub-tasks list */
/* - Get toggl project name from kantree card */
/* - Get toggl tags from kantree card */
/* - Handle card view mode changes */
console.log('Toggl Button loaded for kantree.');

/* Card button */
togglbutton.render('.card-view:not(.toggl)', {observe: true}, function (elem) {
      var link, container = createTag('div', 'kt-card-toggl-btn btn btn-board-menu'),
    cardRef = $('.card-view-header a.ref', elem),
    cardId = cardRef && cardRef.textContent,
    cardTitle = $('.card-view-header h2', elem) && $('.card-view-header h2', elem).textContent,
    taskTitle =  cardId + ' ' + cardTitle,
    projectTitle = $('.board-info .title a').getAttribute("title"),
    descriptionElem = $('.card-view-attributes-form', elem);

  if (!descriptionElem || !taskTitle) {
    return;
  }

  var tagsFunc = function () {
    var index,
      tags = [],
      tagItems = document.querySelectorAll('.attribute-type-group-type .group', elem);

    if (!tagItems) {
      return [];
    }

    for (index in tagItems) {
      if (tagItems.hasOwnProperty(index)) {
        tags.push(tagItems[index].textContent.trim());
      }
    }

    return tags;
  };

  link = togglbutton.createTimerLink({
    className: 'kantree',
    description: taskTitle,
    projectName: projectTitle,
    calculateTotal: true,
    tags: tagsFunc
  });

  container.appendChild(link);
  descriptionElem.parentNode.insertBefore(container, descriptionElem);
}, "#card-modal-host, .card-modal");

/* Checklist buttons */
togglbutton.render('.card-tile-content:not(.toggl)', {observe: true}, function (elem) {
  var link,
    projectTitle = $('.board-info .title a').getAttribute("title"),
    subTaskRef = $('.ref', elem),
    cardRef = $('.card-view-header a.ref').textContent,
    taskDesc = $('.title', elem).textContent,
    taskId = subTaskRef && $('.ref', elem).textContent;

  link = togglbutton.createTimerLink({
    className: 'kantree',
    buttonType: 'minimal',
    projectName: projectTitle,
    description: taskId + ' ' + taskDesc + ' (parent ' + cardRef + ')'
  });

  link.classList.add('kt-checklist-item-toggl-btn');

  if (!taskId) {
    // run toggl after sub-task creation.
    setTimeout(function () {
      subTaskRef.parentNode.prepend(link);
    }, 2000);
  }
  else {
    subTaskRef.parentNode.prepend(link);
  }
}, ".card-view-children .children .card-tile, #card-modal-host, .card-modal");
