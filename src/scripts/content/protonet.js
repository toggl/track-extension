/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.todo-details:not(.toggl)', {observe: true}, function (elem) {
  var link,
    title = $('.name', elem).textContent,
    href = $('.name', elem).getAttribute('href'),
    project = $('ul.breadcrumb li:first-child a', elem).textContent,
    id = href.split("/").pop(-1),
    description = '#' + id + ': ' + title;

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });
  
  $('.actions').appendChild(link);
});
