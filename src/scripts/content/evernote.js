/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false, createTag: false, MutationObserver: false*/
'use strict';

var toggl_container = '#gwt-debug-NoteView-root';
var toggl_btn_container;
var toggl_div_container = '#gwt-debug-NoteAttributesView-root > div > div:nth-child(2)';

var toggl_desc = '#gwt-debug-NoteTitleView-textBox'; // name of note
//var toggl_proj = '#gwt-debug-NotebookSelectMenu-notebookName'; // name of notebook, doesn't work right now

var toggl_btn = '.toggl-button';
var toggl_btn_active = toggl_btn + '.active';

function toggl() {
  // stop previous tracking (clickEvent)
  if ($(toggl_btn_active) !== null) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', true, false);
    $(toggl_btn_active).dispatchEvent(event);
  }

  // delete existing button
  if ($(toggl_btn) !== null) {
    $(toggl_div_container).removeChild(toggl_btn_container);
    $(toggl_container).classList.remove('toggl');
  }

  // create new button
  togglbutton.render(toggl_container + ':not(.toggl)', {observe: true}, function (elem) {
    var link,
      description = $(toggl_desc, elem).value,
      //project = $(toggl_proj, elem).textContent,
      parent = $(toggl_div_container);

    link = togglbutton.createTimerLink({
      className: 'evernote',
      description: description,
      //projectName: project
    });

    toggl_btn_container = createTag('div', 'toggl-wrapper evernote');
    toggl_btn_container.appendChild(link);

    parent.insertBefore(toggl_btn_container, parent.firstChild);
  });
}

// OBSERVATION
// observe changing of notes

var targetString = '#gwt-debug-NoteAttributesView-root > div > div:nth-child(3) > div > div:nth-child(2)';
var target;

function observe() {
  var observer = new MutationObserver(function () {
    toggl();
  }),
    config = {childList: true};
  observer.observe(target, config);
}

// READY
// start observation when page loaded fully

function ready() {
  target = $(targetString);
  if (target !== null) {
    observe();
  } else {
    setTimeout(ready, 1000);
  }
}

ready();
