'use strict';

// Meeting details
togglbutton.render('.popupPanel:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    container = $('._ch_q1 ._ch_f1', elem).parentElement,
    title = $('._ch_q1 ._ch_g1', elem);

  link = togglbutton.createTimerLink({
    className: 'outlook',
    description: title.textContent
  });

  container.appendChild(link);
});

// Meeting peek popup
togglbutton.render('.peekPopup:not(.toggl)', { observe: true }, function(elem) {
  var link,
    otherPeopleContainer = $('._cmm_a1', elem),
    myContainer = $('._ck_i', elem),
    title = $('.ms-font-xl.o365button', elem),
    container;

  // Other people events
  if (otherPeopleContainer) {
    container = otherPeopleContainer;
    link = togglbutton.createTimerLink({
      className: 'outlook',
      description: title.textContent,
      buttonType: 'minimal'
    });
  } else if (myContainer) {
    container = myContainer;
    link = togglbutton.createTimerLink({
      className: 'outlook',
      description: title.textContent
    });
  }

  container.appendChild(link);
});
