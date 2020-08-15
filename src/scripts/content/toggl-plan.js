'use strict';

// Changed from teamweek to Toggl-Plan
// Version active on July 2020
togglbutton.declare({
  elements: {
    title: '[data-hook=name-editor] textarea',
    plan: '[data-hook=plan-editor] [data-hook=input-value]'
  },
  link: {
    observe: '.task-form:not(.toggl)',
    target: '[data-hook=actions-menu]',
    targetInsertion: 'before',
    className: 'toggl-plan',
    description: '{{title}}',
    projectName: '{{plan}}'
  }
});
