'use strict';
/* global togglbutton, $ */

const getTextContent = (element) => element ? element.textContent.trim() : '';

togglbutton.render('[data-qa="channel_name"]:not(.toggl)', { observe: true }, () => {
  const placeholder = $('[data-qa="channel_header__buttons"]').firstChild.parentNode;
  const projectName = $('.p-classic_nav__team_header__team__name');
  const description = $('[data-qa="channel_name"]');

  const link = togglbutton.createTimerLink({
    className: 'slack',
    description: getTextContent(description),
    projectName: getTextContent(projectName),
    buttonType: 'minimal'
  });

  placeholder.insertBefore(link, placeholder.firstChild);
});

togglbutton.render('.c-message--hover:not(.toggl)', { observe: true }, elem => {
  const placeholder = $('.c-message_actions__button:last-child');
  const description = $('.c-message__body', elem);
  const projectName = $('.p-classic_nav__team_header__team__name');
  const isRendered = $('.toggl-button', placeholder) != null;

  if (!description || isRendered) {
    // Non-text message, don't insert button.
    return;
  }

  const button = document.createElement('button');
  const buttonContainer = document.createElement('span');
  const link = togglbutton.createTimerLink({
    className: 'slack-message',
    projectName: getTextContent(projectName),
    description: description.textContent.trim(),
    buttonType: 'minimal'
  });

  buttonContainer.className = 'slack-message-container';
  buttonContainer.appendChild(link);

  button.className = 'c-button-unstyled c-message_actions__button';
  button.setAttribute('type', 'button');
  button.appendChild(buttonContainer);

  placeholder.parentNode.insertBefore(button, placeholder);
});
