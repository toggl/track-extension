'use strict';
/* global createTag */

togglbutton.render('#Pagearea:not(.toggl)', { observe: true }, function (elem) {
  const container = createTag('li', 'ticket-btns');
  const titleElem = $('h2.subject', elem);
  const idElem = $('#ticket-display-id');
  const projectElem = $('.logo_text');
  const buttonsElem = $('.ticket-actions > ul');
  const description = idElem.textContent.trim() + ' ' + titleElem.textContent.trim();

  const link = togglbutton.createTimerLink({
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
  const descriptionElem = $('.ticket-subject-heading');

  // if there's no description element it's overview page, don't show
  if (!descriptionElem) {
    return;
  }

  const descriptionSelector = () => {
    const ticketNumber = $('.breadcrumb__item.active').textContent.trim();
    // Remove other buttons/controls from the ticket subject
    const subjectElement = $('.ticket-subject-heading').cloneNode(true);
    for (const child of subjectElement.children) {
      subjectElement.removeChild(child);
    }

    return `${ticketNumber} ${subjectElement.textContent.trim()}`;
  };

  const link = togglbutton.createTimerLink({
    className: 'freshdesk__mint',
    description: descriptionSelector,
    buttonType: 'minimal',
    tags: () => {
      const tagList = $('.ticket-tags ul');
      if (!tagList ||
        !tagList.children ||
        !tagList.children.length) { return []; }

      return [...tagList.querySelectorAll('li')]
        .map(listItem => {
          const content = listItem.querySelector('.tag-options');
          const tag = content ? content.textContent : '';
          return tag.trim().replace(/[\r\n\t]/ig, ''); /* UI has strange characters in the markup, let's avoid it */
        });
    }
  });

  elem.appendChild(link);
});
