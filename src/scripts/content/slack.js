'use strict';
/* global togglbutton, $ */

togglbutton.render('[data-qa="channel_name"]:not(.toggl)', { observe: true }, () => {
  const placeholder = $('[data-qa="channel_header__buttons"]').firstChild.parentNode;
  const projectName = $('.p-classic_nav__team_header__team__name').textContent.trim();
  const description = $('[data-qa="channel_name"]').textContent.trim();

  const link = togglbutton.createTimerLink({
    className: 'slack',
    description,
    projectName,
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
    projectName: projectName.textContent.trim(),
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
