'use strict';

togglbutton.render('#Pagearea:not(.toggl)', { observe: true }, function(elem) {
  var link,
    container = createTag('li', 'ticket-btns'),
    description,
    titleElem = $('h2.subject', elem),
    idElem = $('#ticket-display-id'),
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

// Freshdesk mint (late 2018)
togglbutton.render('.page-actions__left:not(.toggl)', { observe: true }, elem => {
  const descriptionElem = $('.description-subject');

  // if there's no description element it's overview page, don't show
  if (!descriptionElem) { return }

  const descriptionSelector = () => {
    const ticketNumber = $('.breadcrumb__item.active').textContent.trim();
    const subject = $('.description-subject').textContent.trim();
    return `${ticketNumber} ${subject}`;
  }

  const link = togglbutton.createTimerLink({
    className: 'freshdesk__mint',
    description: descriptionSelector,
    buttonType: 'minimal',
    tags: () => {
      const tagList = $('.list-items');

      if (!tagList ||
        !tagList.children ||
        !tagList.children.length) { return []; }

      return [...tagList.children].map(child => child.textContent);
    }
  })

  elem.appendChild(link);
});
