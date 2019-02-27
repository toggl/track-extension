'use strict';

// Meeting details
togglbutton.render('.popupPanel:not(.toggl)', { observe: true }, function (
  elem
) {
  const container = $('._ch_q1 ._ch_f1', elem).parentElement;
  const title = $('._ch_q1 ._ch_g1', elem);

  const link = togglbutton.createTimerLink({
    className: 'outlook',
    description: title.textContent
  });

  container.appendChild(link);
});

// Meeting peek popup
togglbutton.render('.peekPopup:not(.toggl)', { observe: true }, function (elem) {
  const otherPeopleContainer = $('._cmm_a1', elem);
  const myContainer = $('._ck_i', elem);
  const title = $('.ms-font-xl.o365button', elem);
  let container;
  let link;

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
