'use strict';

// Main function
togglbutton.render(
  // Specify selector for element button needs to hook into
  // Make sure to include :not(.toggl) to avoid duplicates
  '.lp-item-panel__header-actions:not(.toggl)',
  { observe: true },
  function (elem) {
    const taskDescription = document.querySelector(".breadcrumb > a").textContent;
    const projectName = document.querySelector(".breadcrumb :nth-child(3)").textContent.slice(0, -1);	// slice to remove trailing forward slash
    
    // Create timer link element
    const link = togglbutton.createTimerLink({
      description: taskDescription,
      buttonType: 'minimal', // button type, if skipped will render full size
      projectName: projectName,
    });

    // Add link to element
    elem.append(link);
  }
);
