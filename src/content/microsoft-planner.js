/**
 * @name Microsoft Planner
 * @urlAlias planner.cloud.microsoft
 * @urlRegex *://planner.cloud.microsoft/*
 */

'use strict';

togglbutton.render('.taskCard:not(.toggl)', { observe: true }, function (elem) {
  const description = $('.title', elem).textContent;

  function getProject () {
    const plannerTaskboardName = $('.planTaskboardPage .primaryTextSection h1');
    const planName = $('.planName', elem);

    if (plannerTaskboardName) {
      return plannerTaskboardName.textContent;
    }
    if (planName) {
      return planName.textContent;
    }
  }

  const link = togglbutton.createTimerLink({
    className: 'microsoftplanner',
    description: description,
    projectName: getProject,
    buttonType: 'minimal'
  });
  $('.leftSection', elem).appendChild(link);
});

// Redesigned board cards (Fluent layout). The legacy .taskCard/.title/.leftSection
// selectors are gone; cards are now .planner-draggable-task-card with a stable
// .taskMenuSection action area and a role="textbox" title. Self-heal via
// :not(:has(.toggl-button)) so the button survives the card re-rendering.
togglbutton.render(
  '.planner-draggable-task-card:not(:has(.toggl-button))',
  { observe: true },
  function (card) {
    const menu = card.querySelector('.taskMenuSection');
    if (!menu || menu.querySelector('.toggl-button')) {
      return;
    }

    function getDescription() {
      const title = card.querySelector('[role="textbox"]');
      return title ? title.textContent.trim() : '';
    }

    function getProject() {
      // The card has no plan name; it's the last breadcrumb item in the board
      // header. Fall back to the legacy taskboard header for old-layout tenants.
      const breadcrumbItems = document.querySelectorAll(
        '.fui-Breadcrumb__list .fui-BreadcrumbItem'
      );
      const planItem = breadcrumbItems[breadcrumbItems.length - 1];
      if (planItem) {
        return planItem.textContent.trim();
      }
      const legacyHeader = $('.planTaskboardPage .primaryTextSection h1');
      return legacyHeader ? legacyHeader.textContent.trim() : '';
    }

    const link = togglbutton.createTimerLink({
      className: 'microsoftplanner',
      description: getDescription,
      projectName: getProject,
      buttonType: 'minimal'
    });

    menu.appendChild(link);
  }
);
