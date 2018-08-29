'use strict';

togglbutton.render('#Pagearea:not(.toggl)', { observe: true }, function(elem) {
  var link,
    container = createTag('li', 'ticket-btns'),
    //duration,
    description,
    titleElem = $('h2.subject', elem),
    idElem = $('#ticket-display-id'),
    //trackedContainer = createTag('div', 'open-box toggl-time-tracked'),
    //trackedElem = $('.open-box'),
    projectElem = $('.logo_text'),
    buttonsElem = $('.ticket-actions > ul');

  description = idElem.textContent.trim() + ' ' + titleElem.textContent.trim();
  link = togglbutton.createTimerLink({
    className: 'freshdesk',
    description: description,
    projectName: projectElem && projectElem.textContent.trim(),
    calculateTotal: true
  });

  container.appendChild(link);
  buttonsElem.appendChild(container, buttonsElem);
});
