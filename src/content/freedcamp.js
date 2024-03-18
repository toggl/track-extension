/**
 * @name Freedcamp
 * @urlAlias freedcamp.com
 * @urlRegex *://*.freedcamp.com/*
 */
'use strict';

function tagsSelector() {
  const tagsElem = document.querySelectorAll('.AgTagItem--fk-AgTagItem');
  const tags = [...tagsElem].map(tagEl => tagEl.textContent.trim())
  return tags
}

togglbutton.render(
  '.AgListViewTask--fk-AgListViewTask-Body:not(.toggl)',
  { observe: true },
  function (elem) {
    const projectElem = $('.AgSidebarCurrentProject--fk-AgSidebarContext-ProjText')
   
    const descriptionElem = $('.AgListViewTask--fk-AgListViewTask-Title', elem);
    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'freedcamp',
      projectName: projectElem?.textContent,
      description: descriptionElem?.textContent,
    });
    elem.appendChild(link);
  }
);


togglbutton.render(
  '.ItemViewSubheader--fk-ItemBasicFields-Title:not(.toggl)',
  { observe: true },
  function (elem) {
    const projectElem = $('.AgSidebarCurrentProject--fk-AgSidebarContext-ProjText')
    const descriptionElem = $('.ItemViewSubheader--fk-ItemBasicFields-Title');
    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'freedcamp',
      projectName: projectElem?.textContent,
      description: descriptionElem?.textContent,
      tags: tagsSelector
    });
    elem.parentNode.insertBefore(link, elem.nextSibling);
  }
);
