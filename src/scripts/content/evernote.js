/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag: false*/
'use strict';

togglbutton.render('#gwt-debug-NoteView-root:not(.toggl)', {observe: true}, function (elem) {
  var link,
    descFunc,
    projectFunc,
    container,
    parent = $('#gwt-debug-NoteAttributesView-root > div > div:nth-child(2)', elem);

  descFunc = function () {
    var desc = $('#gwt-debug-NoteTitleView-textBox');
    return desc ? desc.value : "";
  };

  projectFunc = function () {
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
});