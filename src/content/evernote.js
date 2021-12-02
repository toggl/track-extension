'use strict';

togglbutton.render('#qa-NOTE_HEADER:not(.toggl)', { observe: true }, function (elem) {
  if (elem.querySelector('.toggl-button')) {
    // Check for existence in case it's there from previous render (SPA)
    return;
  }

  const projectFunc = function () {
    const projectElem = $('#qa-NOTE_PARENT_NOTEBOOK_BTN');
    return projectElem ? projectElem.textContent : '';
  };

  const descriptionFunc = function () {
    // FIXME: We can't get the description properly because it's in an iFrame
    // This classname is the only indication of the "active" note in the sidebar, and this is guaranteed to break someday.
    const descriptionElem = $('[id*=_qa-NOTES_SIDEBAR_NOTE].TSUJykWrzFUwd6gUIDTTl [id*=_qa-NOTES_SIDEBAR_NOTE_TITLE]');
    return descriptionElem ? descriptionElem.textContent.trim() : '';
  };

  const link = togglbutton.createTimerLink({
    projectName: projectFunc,
    description: descriptionFunc,
    buttonType: 'minimal',
    className: 'evernote'
  });

  // Insert at the start of the same header segment as the share button
  elem
    .querySelector('#qa-SHARE_BUTTON')
    .parentNode
    .prepend(link);
});
