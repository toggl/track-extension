'use strict';

// Issue and Pull Request Page
togglbutton.render('.zhc-menu-bar > .zhc-menu-bar-item:not(.toggl):first-child', { observe: true }, function (
  elem
) {
  const numElem = $('.zhc-issue-description__number');
  const titleElem = $('.zhc-issue-description__title');

  let description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description.trim().replace(numElem.textContent, '');
  }

  const div = document.createElement('div');
  div.classList.add('zhc-menu-bar-item', 'toggl');

  const link = togglbutton.createTimerLink({
    className: 'zenhub',
    description: description
  });

  div.appendChild(link);
  elem.parentNode.prepend(div);
});
