'use strict';

// Backlog Q1 2019: Task view
togglbutton.render(
  '#issueArea:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionText = () => `${elem.querySelector('.ticket__key .ticket__key-number').textContent} ${elem.querySelector('#summary .title-group__title-text').textContent}`;
    const projectText = () => document.querySelector('.project-header .header-icon-set__name').textContent;

    const link = togglbutton.createTimerLink({
      className: 'Backlog',
      description: descriptionText,
      projectName: projectText,
      calculateTotal: true
    });

    elem.querySelector('#summary *:first-child').appendChild(link);
  }
);

// Backlog Q3 2021: Task header
togglbutton.render(
  '#ui-state-disabledissue:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionText = () => `${elem.querySelector('.header-icon-set__key').textContent} ${elem.querySelector('.header-icon-set__summary').textContent}`;
    const projectText = () => document.querySelector('.project-header .header-icon-set__name').textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'Backlog',
      description: descriptionText,
      projectName: projectText,
      calculateTotal: true
    });

    elem.querySelector('.header-icon-set__text.content-header__summary').after(link);
  }
);

// Backlog Q3 2021: Issues table
togglbutton.render(
  '#issues-table tbody tr:not(.toggl)',
  { observe: true },
  elem => {
    const descriptionText = () => `${elem.querySelector('.cell-key').textContent} ${elem.querySelector('.cell-summary').textContent}`;
    const projectText = () => (elem.querySelector('.cell-project-name') || document.querySelector('.project-header .header-icon-set__name')).textContent;

    const link = togglbutton.createTimerLink({
      buttonType: 'minimal',
      className: 'Backlog-2021',
      description: descriptionText,
      projectName: projectText
    });

    elem.querySelector('td:nth-child(2)').prepend(link);
  }
);
