'use strict';

togglbutton.render('#issueArea:not(.toggl)', { observe: true }, function(elem) {
  var link,
    container = createTag('span', ''),
    descFunc,
    ticketNumElem = $('.ticket__key .ticket__key-number', elem),
    titleElem = $('h3#summary span.title-group__title-text', elem),
    projectElem = $('.project-header h1 .header-icon-set__name'),
    descriptionElem = $('#summary span');

  if (!descriptionElem) {
    return;
  }

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
  descriptionElem.parentNode.appendChild(container, descriptionElem);
});
