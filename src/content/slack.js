/**
 * @name Slack
 * @urlAlias slack.com
 * @urlRegex *://*.slack.com/*
 */
'use strict';

const getTextContent = (element) => element ? element.textContent.trim() : '';

const getWorkspaceName = () => getTextContent($('.p-ia4_home_header_menu__team_name'));

togglbutton.render('.p-view_header__actions:not(.toggl)', { observe: true }, (elem) => {
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

  const button = document.createElement('button');

  button.className = 'c-button-unstyled c-icon_button c-icon_button--size_medium p-toggle_channel_space_action_button display_flex align_items_center p-toggle_channel_space_action_button--text p-toggle_channel_space_action--overlay c-icon_button--default';
  button.appendChild(link);

  elem.insertBefore(button, elem.firstChild);
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

  button.className = 'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_small c-message_actions__button';
  button.setAttribute('type', 'button');
  button.appendChild(link);

  placeholder.parentNode.insertBefore(button, placeholder);
});
