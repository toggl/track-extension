/**
 * @name Github
 * @urlAlias github.com
 * @urlRegex *://github.com/*
 */
'use strict';

// We need it to get the issue name, the tag value is being changed dynamically
const getPaneTitle = async (elem) => {
  return new Promise(resolve => {
    const title = setInterval(() => {
      const titleElem = elem.querySelector('#__primerPortalRoot__ header h2 span')
      if (!!titleElem.textContent) {
        clearInterval(title)
        resolve(titleElem.textContent)
      }
    }, 100)
  })
} 

// Issue and Pull Request Page
togglbutton.render('#partial-discussion-sidebar', { observe: true }, function (
  elem
) {
  const numElem = $('.gh-header-number');
  const titleElem = $('.js-issue-title');
  const projectElem = $('h1.public strong a, h1.private strong a');
  const existingTag = $('.discussion-sidebar-item.toggl');

  // Check for existing tag, create a new one if one doesn't exist or is not the first one
  // We want button to be the first one because it looks different from the other sidebar items
  // and looks very weird between them.

  if (existingTag) {
    if (existingTag.parentNode.firstChild.classList.contains('toggl')) {
      return;
    }
    existingTag.parentNode.removeChild(existingTag);
  }

  let description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description.trim();
  }

  const div = document.createElement('div');
  div.classList.add('discussion-sidebar-item', 'toggl');

  const link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  div.appendChild(link);
  elem.prepend(div);
});

// Project Page side pane
togglbutton.render('div[role="dialog"]:not(.toggl)', { observe: true }, async function (
  elem
) {
  const numElem = elem.querySelector('#__primerPortalRoot__ header a')
  const projectElem = document.querySelector('#memexTitleInput')

  const parent = document.querySelector('dl')
  const title = await getPaneTitle(elem)

  let description = title;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description.trim();
  }

  const div = document.createElement('div');
  div.classList = parent.children[0].classList.value;
  div.style.paddingLeft = '16px'
  
  let projectName = ''
  if (projectElem) projectName = projectElem.value

  const link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectName
  });

  div.appendChild(link);
  parent.prepend(div)
});

// Project Page
togglbutton.render('.js-project-card-details .js-comment:not(.toggl)', { observe: true }, function (
  elem
) {
  const titleElem = $('.js-issue-title');
  const numElem = $('.js-project-card-details .project-comment-title-hover span.color-text-tertiary');
  const projectElem = $('h1.public strong a, h1.private strong a');

  let description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description.trim();
  }

  const link = togglbutton.createTimerLink({
    className: 'github',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  const wrapper = createTag('div', 'discussion-sidebar-item js-discussion-sidebar-item');
  wrapper.appendChild(link);

  const target = $('.discussion-sidebar-item');
  target.parentNode.insertBefore(wrapper, target);
});
