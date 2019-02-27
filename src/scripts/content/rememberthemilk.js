'use strict';

togglbutton.render(
  "div[role='listbox'] [role='option']:not(.toggl)",
  { observe: true },
  function (elem) {
    // Get task's description.
    const getDescription = function () {
      return elem
        .querySelector(
          "div[role='listbox'] [role='option'] span[style*='user-select: text']"
        )
        .textContent.trim();
    };

    // Get project name if in project task view
    const getProject = function () {
      const p = $('.b-Mj.b-wd .b-f-n');
      if (!p) {
        return;
      }
      return p.textContent;
    };

    // Create and return toggl button's instance.
    const createTogglButton = function () {
      return togglbutton.createTimerLink({
        className: 'rememberthemilk',
        description: getDescription,
        projectName: getProject,
        buttonType: 'minimal'
      });
    };

    // Inject toggl button to each task.
    elem
      .querySelector(
        "div[role='listbox'] [role='option'] span[style*='user-select: text']"
      )
      .parentElement.appendChild(createTogglButton());
  }
);
