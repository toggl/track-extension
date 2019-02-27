'use strict';

togglbutton.render('div.card.conversation__card.o__in-list:not(.o__hoverable):not(.toggl)', { observe: true }, function (elem) {
  const description = $('div.conversation__card__title__text', elem).innerText.trim();
  const link = togglbutton.createTimerLink({
    className: 'intercom',
    description: description,
    buttonType: 'minimal'
  });

  if ($('.toggl-button.intercom') !== null) {
    $('.toggl-button.intercom').remove();
  }

  $('.js__conversation-controls-action-icons', elem).appendChild(link);
});
