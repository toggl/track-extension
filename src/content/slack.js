'use strict';
/* global togglbutton, $ */

const getTextContent = (element) => element ? element.textContent.trim() : '';

const getWorkspaceName = () => getTextContent($('.p-ia__sidebar_header__team_name_text'));

togglbutton.render('.p-ia__view_header:not(.toggl)', { observe: true }, (elem) => {
  const description = $('[data-qa="channel_name"]');
  const isRendered = $('.toggl-button', elem) != null;

  if (isRendered) {
    // Do not duplicate the button.
    return;
  }

  const link = togglbutton.createTimerLink({
    className: 'slack',
    description: getTextContent(description),
    projectName: getWorkspaceName,
    buttonType: 'minimal'
  });

  elem.insertBefore(link, elem.lastChild);
});

togglbutton.render('.c-message_kit__hover:not(.toggl)', { observe: true }, elem => {
  const placeholder = $('.c-message_actions__button:last-child');
  const description = elem.closest('.c-message_kit__message').querySelector('.c-message_kit__blocks--rich_text');
  const isRendered = $('.toggl-button', placeholder.parentNode) != null;

  if (isRendered) {
    return;
  }

  const getDescription = () => getTextContent(description);

  const link = togglbutton.createTimerLink({
    className: 'slack-message',
    projectName: getWorkspaceName,
    description: getDescription,
    buttonType: 'minimal'
  });

  const button = document.createElement('button');
  const buttonContainer = document.createElement('span');
  buttonContainer.className = 'slack-message-container';

  button.className = 'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_small c-message_actions__button';
  button.setAttribute('type', 'button');
  button.appendChild(link);

  placeholder.parentNode.insertBefore(button, placeholder);
});
