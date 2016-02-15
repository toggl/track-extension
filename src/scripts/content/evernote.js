/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.focus-NotesView-Note-snippetContent:not(.toggl)', {observe: true}, function (elem) {

  var link,
    snippet = $('.focus-NotesView-Note-snippet', elem),
    description = snippet ? snippet.textContent : '',
    project = $('.focus-NotesView-Note-noteTitle').textContent;

  link = togglbutton.createTimerLink({
    className: 'Evernote',
    description: description,
    projectName: project
  });

  $('.focus-NotesView-Note-snippetContent').appendChild(link);

});
