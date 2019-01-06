'use strict';

// New evernote layout 2018-09
togglbutton.render('.COQHL4z_Ex89cLdhOUVJp:not(.toggl)', { observe: true }, function (elem) {
  var projectFunc, descriptionFunc, link;

  projectFunc = function () {
    var projectElem = $('#qa-NOTE_PARENT_NOTEBOOK_BTN');
    return projectElem ? projectElem.textContent : '';
  }

  descriptionFunc = function () {
    var descriptionElem = $('#qa-NOTE_EDITOR_TITLE');
    return descriptionElem ? descriptionElem.value : '';
  }

  link = togglbutton.createTimerLink({
    projectName: projectFunc,
    description: descriptionFunc,
    buttonType: 'minimal',
    className: 'evernote-2018'
  });

  elem.appendChild(link);
})

togglbutton.render(
  '#gwt-debug-NoteView-root:not(.toggl)',
  { observe: true },
  function(elem) {
    var link,
      descFunc,
      projectFunc,
      container,
      parent = $(
        '#gwt-debug-NoteAttributesView-root > div > div:nth-child(2)',
        elem
      );

    descFunc = function() {
      var desc = $('#gwt-debug-NoteTitleView-textBox');
      return desc ? desc.value : '';
    };

    projectFunc = function() {
      return $('#gwt-debug-NotebookSelectMenu-notebookName').textContent;
    };

    link = togglbutton.createTimerLink({
      className: 'evernote',
      description: descFunc,
      projectName: projectFunc
    });

    container = createTag('div', 'toggl-wrapper evernote');
    container.appendChild(link);

    parent.insertBefore(container, parent.firstChild);
  }
);
