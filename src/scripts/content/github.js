'use strict';

// Issue and Pull Request Page
togglbutton.declare({
  elements: {
    title: '.js-issue-title',
    num: '.gh-header-number',
    project: 'h1 strong a'
  },
  link: {
    observe: '#partial-discussion-sidebar:not(.toggl)',
    target: '.discussion-sidebar-item',
    targetInsertion: 'before',
    linkWrapper: ['div', 'discussion-sidebar-item toggl'],
    className: 'github',
    largeButton: true,
    description: '{{#num}}{{num}} {{/num}}{{title}}',
    projectName: '{{project}}'
  }
});

// Project Page
togglbutton.declare({
  elements: {
    title: '.js-issue-title',
    num: '.js-project-card-details .project-comment-title-hover span.text-gray-light',
    project: 'h1 strong a'
  },
  link: {
    observe: '.js-project-card-details .js-comment:not(.toggl)',
    target: '.discussion-sidebar-item',
    targetInsertion: 'before',
    linkWrapper: ['div', 'discussion-sidebar-item js-discussion-sidebar-item'],
    className: 'github',
    largeButton: true,
    description: '{{#num}}{{num}} {{/num}}{{title}}',
    projectName: '{{project}}'
  }
});
