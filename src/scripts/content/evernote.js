'use strict';

// New evernote layout 2018-09
togglbutton.render('.COQHL4z_Ex89cLdhOUVJp:not(.toggl)', { observe: true }, function (elem) {
  const projectFunc = function () {
    const projectElem = $('#qa-NOTE_PARENT_NOTEBOOK_BTN');
    return projectElem ? projectElem.textContent : '';
  };

  const descriptionFunc = function () {
    const descriptionElem = $('#qa-NOTE_EDITOR_TITLE');
    return descriptionElem ? descriptionElem.value : '';
  };

  const link = togglbutton.createTimerLink({
    projectName: projectFunc,
    description: descriptionFunc,
    buttonType: 'minimal',
    className: 'evernote-2018'
  });

  elem.appendChild(link);
});

togglbutton.render(
  '#gwt-debug-NoteView-root:not(.toggl)',
  { observe: true },
  function (elem) {
    const parent = $(
      '#gwt-debug-NoteAttributesView-root > div > div:nth-child(2)',
      elem
    );

    const descFunc = function () {
      const desc = $('#gwt-debug-NoteTitleView-textBox');
      return desc ? desc.value : '';
    };

    const projectFunc = function () {
      return $('#gwt-debug-NotebookSelectMenu-notebookName').textContent;
    };

    const link = togglbutton.createTimerLink({
      className: 'evernote',
      description: descFunc,
      projectName: projectFunc
    });

    const container = createTag('div', 'toggl-wrapper evernote');
    container.appendChild(link);

    parent.insertBefore(container, parent.firstChild);
  }
);
