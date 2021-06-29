'use strict';

// Intercom 2021
togglbutton.render('[data-conversation-id] > * [data-intercom-target="conversation-card-header"]:not(.toggl)', { observe: true }, elem => {
  const descriptionSelector = () => {
    const titleContainer = elem.querySelector('.conversation__card__title__text');
    const customTitleInput = titleContainer.querySelector('input');

    if (customTitleInput && customTitleInput.value) {
      return customTitleInput.value;
    }

    return titleContainer.textContent.replace(/\s\s+/g, ' ').replaceAll('\n', '').trim();
  };
  const link = togglbutton.createTimerLink({ className: 'intercom', description: descriptionSelector, buttonType: 'minimal' });

  elem.appendChild(link);
});
