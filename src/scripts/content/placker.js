'use strict';
/* global createTag */

togglbutton.render(
  '.plackerModal:not(.toggl)',
  { observe: true },
  (elem) => {
    const interval = setInterval(function () {
      const actionButton = $('.dialogCardHeaderOverviewComponent__bottomRight');

      if (!actionButton) {
        return;
      }

      clearInterval(interval);

      const getProject = () => {
        const project = $('.breadcrumbComponent .breadcrumbComponent__item:first-child .breadcrumbComponent__itemLink', elem);
        return project ? project.textContent.trim() : '';
      };

      const getDescription = () => {
        const description = $('.dialogCardHeaderOverviewComponent__titleInput', elem);
        return description ? description.textContent.trim() : '';
      };

      const container = createTag('div', 'button-link placker-tb-wrapper');
      const link = togglbutton.createTimerLink({
        className: 'placker',
        description: getDescription,
        projectName: getProject,
        container: '.plackerModal'
      });

      // Pass through click on placker button to the timer link
      container.addEventListener('click', (e) => {
        e.preventDefault();
        link.click();
      });

      container.appendChild(link);
      actionButton.prepend(container);
    }, 100);
  },
  '.plackerModal'
);
