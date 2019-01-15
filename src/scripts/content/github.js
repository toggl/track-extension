'use strict';

// Issue and Pull Request Page
togglbutton.render('#partial-discussion-sidebar', { observe: true }, function(
  elem
) {
  var div,
    link,
    description,
    numElem = $('.gh-header-number'),
    titleElem = $('.js-issue-title'),
    projectElem = $('h1.public strong a, h1.private strong a'),
    existingTag = $('.discussion-sidebar-item.toggl');

  // Check for existing tag, create a new one if one doesn't exist or is not the first one
  // We want button to be the first one because it looks different from the other sidebar items
  // and looks very weird between them.

  if (existingTag) {
    if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
      return;
    }
    existingTag.parentNode.removeChild(existingTag);
  }

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description.trim();
  }

  div = document.createElement('div');
  div.classList.add('discussion-sidebar-item', 'toggl');

  link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  div.appendChild(link);
  elem.prepend(div);
});


// Project Page
togglbutton.render('.js-project-card-details .js-comment:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description,
    target,
    wrapper,
    titleElem = $('.js-issue-title'),
    numElem = $('.js-issue-number'),
    projectElem = $('h1.public strong a, h1.private strong a');

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description.trim();
  }

  link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  wrapper = createTag('div', 'discussion-sidebar-item js-discussion-sidebar-item');
  wrapper.appendChild(link);

  target = $('.discussion-sidebar-item');
  target.parentNode.insertBefore(wrapper, target);
});
