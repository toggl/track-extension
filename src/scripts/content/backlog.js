'use strict';

togglbutton.render('#issueArea:not(.toggl)', { observe: true }, function(elem) {
  var link,
    container = createTag('span', ''),
    descFunc,
    ticketNumElem = $('.ticket__key .ticket__key-number', elem),
    titleElem = $('#summary .title-group__title-text', elem),
    projectElem = $('.project-header .header-icon-set__name'),
    containerElem = $('#summary *:first-child');

  descFunc = function() {
    return ticketNumElem.textContent + ' ' + titleElem.textContent;
  };

  link = togglbutton.createTimerLink({
    className: 'Backlog',
    description: descFunc,
    projectName: projectElem.textContent,
    calculateTotal: true
  });

  container.appendChild(link);
  containerElem.parentNode.appendChild(container, containerElem);
});
