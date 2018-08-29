'use strict';

// Jira 2017 board sidebar
togglbutton.render(
  '#ghx-detail-view [spacing] h1:not(.toggl)',
  { observe: true },
  function() {
    var link,
      description,
      rootElem = $('#ghx-detail-view'),
      container = createTag('div', 'jira-ghx-toggl-button'),
      titleElem = $('[spacing] h1', rootElem),
      numElem = $('[spacing] a', rootElem),
      projectElem = $('.bgdPDV');

    description = titleElem.textContent;
    if (numElem !== null) {
      description = numElem.textContent + ' ' + description;
    }

    link = togglbutton.createTimerLink({
      className: 'jira2017',
      description: description,
      buttonType: 'minimal',
      projectName: projectElem && projectElem.textContent
    });

    container.appendChild(link);
    numElem.parentNode.appendChild(container);
  }
);

// Jira 2018-06 new sprint modal
// Using the h1 as selector to make sure that it will only try to render the button
// after Jira has fully rendered the modal content
togglbutton.render(
  'div[role="dialog"].sc-ckVGcZ h1:not(.toggl)',
  { observe: true },
  function(needle) {
    var root = needle.closest('div[role="dialog"]'),
      id = $('a:first-child', root),
      description = $('h1:first-child', root),
      project = $('.sc-kMoxaV'),
      container = createTag('div', 'jira-ghx-toggl-button'),
      link;

    if (project === null) {
      project = $('.sc-iyvyFf:first-child');
    }

    if (id !== null && description !== null && project !== null) {
      link = togglbutton.createTimerLink({
        className: 'jira2017',
        description: id.textContent + ' ' + description.textContent,
        projectName: project && project.textContent
      });

      container.appendChild(link);
      id.parentNode.appendChild(container);
    }
  }
);

// Jira 2018-08 sprint modal
// Using the h1 as selector to make sure that it will only try to render the button
// after Jira has fully rendered the modal content
togglbutton.render(
  'div[role="dialog"].sc-krDsej h1:not(.toggl)',
  { observe: true },
  function(needle) {
    var root = needle.closest('div[role="dialog"]'),
      id = $('a:first-child', root),
      description = $('h1:first-child', root),
      project = $('.sc-cremA'),
      container = createTag('div', 'jira-ghx-toggl-button'),
      link;

    if (id !== null && description !== null && project !== null) {
      link = togglbutton.createTimerLink({
        className: 'jira2018',
        description: id.textContent + ' ' + description.textContent,
        projectName: project && project.textContent,
        buttonType: 'minimal'
      });

      container.appendChild(link);
      $('.sc-iBmynh', root).appendChild(container);
    }
  }
);

// Jira 2018 sprint modal
// Using the h1 as selector to make sure that it will only try to render the button
// after Jira has fully rendered the modal content
togglbutton.render(
  'div[role="dialog"] .ffQQbf:not(.toggl)',
  { observe: true },
  function(needle) {
    var root = needle.closest('div[role="dialog"]'),
      id = $('a:first-child', root),
      description = $('h1:first-child', root),
      project = $('.bgdPDV'),
      container = createTag('div', 'jira-ghx-toggl-button'),
      link;

    if (id !== null && description !== null && project !== null) {
      link = togglbutton.createTimerLink({
        className: 'jira2017',
        description: id.textContent + ' ' + description.textContent,
        projectName: project && project.textContent
      });

      container.appendChild(link);
      id.parentNode.appendChild(container);
    }
  }
);

// Jira 2017 issue page
togglbutton.render(
  '.issue-header-content:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description,
      numElem = $('#key-val', elem),
      titleElem = $('#summary-val', elem) || '',
      projectElem = $('.bgdPDV');

    if (!!titleElem) {
      description = titleElem.textContent.trim();
    }

    if (numElem !== null) {
      if (!!description) {
        description = ' ' + description;
      }
      description = numElem.textContent + description;
    }

    // JIRA server support
    if (projectElem === null) {
      projectElem = $('#project-name-val');
    }

    link = togglbutton.createTimerLink({
      className: 'jira2017',
      description: description,
      projectName: projectElem && projectElem.textContent.trim()
    });

    link.style.marginLeft = '8px';

    var issueLinkContainer =
      $('.issue-link').parentElement || $('.aui-nav li').lastElementChild;
    issueLinkContainer && issueLinkContainer.appendChild(link);
  }
);

// Jira pre-2017
togglbutton.render('#ghx-detail-issue:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description,
    container = createTag('div', 'ghx-toggl-button'),
    titleElem = $('[data-field-id="summary"]', elem),
    numElem = $('.ghx-fieldname-issuekey a'),
    projectElem = $('.ghx-project', elem);

  description = titleElem.textContent;
  if (numElem !== null) {
    description = numElem.textContent + ' ' + description;
  }

  link = togglbutton.createTimerLink({
    className: 'jira',
    description: description,
    projectName: projectElem && projectElem.textContent
  });

  container.appendChild(link);
  $('#ghx-detail-head').appendChild(container);
});

// Jira pre-2017
togglbutton.render(
  '.issue-header-content:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      description,
      ul,
      li,
      numElem = $('#key-val', elem),
      titleElem = $('#summary-val', elem) || '',
      projectElem = $('#project-name-val', elem);

    if (!!titleElem) {
      description = titleElem.textContent;
    }

    if (numElem !== null) {
      if (!!description) {
        description = ' ' + description;
      }
      description = numElem.textContent + description;
    }

    link = togglbutton.createTimerLink({
      className: 'jira',
      description: description,
      projectName: projectElem && projectElem.textContent
    });

    ul = createTag('ul', 'toolbar-group');
    li = createTag('li', 'toolbar-item');
    li.appendChild(link);
    ul.appendChild(li);
    $('.toolbar-split-left').appendChild(ul);
  }
);

//Confluence
togglbutton.render('#title-heading:not(.toggl)', { observe: true }, function(
  elem
) {
  var link,
    description,
    titleElem = $('[id="title-text"]', elem);

  description = titleElem.textContent.trim();

  link = togglbutton.createTimerLink({
    className: 'confluence',
    description: description
  });

  $('#title-text').appendChild(link);
});
