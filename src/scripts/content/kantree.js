'use strict';
/* global togglbutton, $ */

/** Features:
 *  - Add timer to the card
 *  - Add timer to the sub-tasks list
 *  - Get toggl project name from kantree card
 *  - Get toggl tags from kantree card
 *  - Handle card view mode changes
 */

/* Card button */
togglbutton.render(
  '.card-view:not(.toggl)',
  { observe: true },
  (elem) => {
    const buildTaskTitle = () => {
      const cardRef = $('.card-view-header a.ref', elem) || false;

      if (!cardRef || !cardRef.innerHTML) {
        return false;
      }

      const cardId = cardRef.innerHTML;
      const cardTitle = $('.card-view-header h2', elem) && $('.card-view-header h2', elem).textContent;
      return `${cardId} ${cardTitle}`;
    };

    const descElem = $('.card-view-attributes-form', elem);
    const container = createTag('div', 'kt-card-toggl-btn');
    const taskTitle = buildTaskTitle();

    if (!descElem || !taskTitle) {
      return;
    }

    const getTags = () => {
      const tags = [];
      const tagItems = document.querySelectorAll('.attribute-type-group-type .group', elem);

      if (!tagItems) {
        return tags;
      }

      for (const index in tagItems) {
        if (tagItems.hasOwnProperty(index)) {
          tags.push(tagItems[index].textContent.trim());
        }
      }
      return tags;
    };

    const link = togglbutton.createTimerLink({
      className: 'kantree',
      description: taskTitle,
      projectName: getProjTitle,
      calculateTotal: true,
      tags: getTags
    });

    container.appendChild(link);
    descElem.parentNode.insertBefore(container, descElem);
  },
  '#card-modal-host, .card-modal'
);

togglbutton.render(
  '.card-tile-content:not(.toggl)',
  { observe: true },
  function (elem) {
    const subTaskRef = $('.ref', elem) || false;

    if (!subTaskRef) {
      return false;
    }

    const buildDesc = () => {
      let desc = false;
      try {
        const taskDesc = $('.title', elem).textContent.trim();
        const cardRef = $('.card-view-header a.ref').textContent.trim();
        desc = `Subtask ${taskId}: ${taskDesc} (on task ${cardRef})`;
      } catch (e) {}
      return desc;
    };

    const taskId = subTaskRef.textContent.trim();

    const link = togglbutton.createTimerLink({
      className: 'kantree',
      buttonType: 'minimal',
      description: buildDesc,
      projectName: getProjTitle
    });

    link.classList.add('kt-checklist-item-toggl-btn');

    if (!taskId) {
      // run toggl after sub-task creation.
      setTimeout(function () {
        subTaskRef.parentNode.prepend(link);
      }, 2000);
    } else {
      subTaskRef.parentNode.prepend(link);
    }
  },
  '.card-view-children .children .card-tile, #card-modal-host, .card-modal'
);

function getProjTitle () {
  const $selector = $('.board-nav-title .title') || $('.project-panel-title');
  return $selector
    ? $selector.textContent.trim()
    : '';
}
