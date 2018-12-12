'use strict';

function getProjectName(item) {
  var projectItems = item.parentNode.getElementsByClassName('project_item__name');

  if (projectItems.length > 0) {
    return projectItems[0].textContent;
  }

  const closestEditor = item.closest('.list_editor')

  return closestEditor ? closestEditor.querySelector('a.project_link span').textContent : '';
}

function getTags(item) {
  var tags = item.querySelectorAll('.labels_holder a:not(.label_sep)')

  return Array.from(tags).map(function(tag) {
    return tag.textContent;
  });
}

togglbutton.render(
  '.task_item .content:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      descFunc,
      container = $('.text', elem);

    descFunc = function() {
      var clone = container.cloneNode(true),
        i = 0,
        child = null;

      while (clone.children.length > i) {
        child = clone.children[i];
        if (
          child.tagName === 'B' ||
          child.tagName === 'I' ||
          child.tagName === 'STRONG' ||
          child.tagName === 'EM'
        ) {
          i++;
        } else if (child.tagName === 'A') {
          if (
            child.classList.contains('ex_link') ||
            child.getAttribute('href').indexOf('mailto:') === 0
          ) {
            i++;
          } else {
            child.remove();
          }
        } else {
          child.remove();
        }
      }

      return clone.textContent.trim();
    };

    link = togglbutton.createTimerLink({
      className: 'todoist',
      description: descFunc(),
      projectName: getProjectName(elem),
      tags: getTags(elem)
    });

    container.insertBefore(link, container.lastChild);
  }
);
