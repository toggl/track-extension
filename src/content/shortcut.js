/**
 * @name Shortcut
 * @urlAlias app.shortcut.com
 * @urlRegex *://app.shortcut.com/*
 */
'use strict';

togglbutton.render('#story-dialog-state-dropdown:not(.toggl)', { observe: true }, function (
  elem
) {
  const wrap = createTag('div');
  const element = elem;
  elem = elem.parentNode.parentNode.parentNode.parentNode;

  const getDescription = function () {
    const storyId = $('.story-id input', elem).value;
    const title = $('h2.story-name', elem).textContent;

    return `#${storyId} - ${title}`;
  };

  const getProject = function () {
    return $('.story-epic .value', elem)?.textContent;
  };

  const link = togglbutton.createTimerLink({
    className: 'toggl-shortcut',
    description: getDescription,
    projectName: getProject
  });

  wrap.className = 'attribute editable-attribute toggl-button-shortcut-wrapper';
  wrap.appendChild(link);
  element.parentNode.insertBefore(wrap, element.nextSibling);
});
