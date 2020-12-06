'use strict';

togglbutton.render('#qa-NOTE_HEADER:not(.toggl)', { observe: true }, function (elem) {
  if ($('.toggl-button', elem)) {
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
  $('#qa-SHARE_BUTTON', elem)
    .parentNode
    .prepend(link);
});
