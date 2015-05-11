/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.todo-details:not(.toggl)', {observe: true}, function (elem) {
  var link,
    title = $('.name', elem).textContent,
    href = $('.name', elem).getAttribute('href'),
    project = $('ul.breadcrumb li:nth-child(3) a', elem).textContent,
    id = href.split("/").pop(-1),
    description = '#' + id + ': ' + title;

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });
  
  $('.actions', elem).appendChild(link);
});


togglbutton.render('.detail-content-wrapper li.meep.Meep:not(.toggl)', {observe: true}, function (elem) {
  var link, project,
    project = $('.detail-content-wrapper .name').textContent,
    title = $('.message', elem).textContent,
    href = window.location.href + $('.meta .time', elem).getAttribute('href'),
    id = href.split("meep_id=").pop(-1),
    description = 'Nachricht #' + id + ' (' + href + ')',
    destroyLink = $('.remove', elem);

  link = togglbutton.createTimerLink({
    className: 'protonet',
    description: description,
    projectName: project
  });
  
  link.style.position = 'relative';
  link.style.top = '1px';
  link.style.marginTop = '-1px';
  link.style.marginLeft = '4px';
  link.style.paddingTop = '1px';
  link.style.opacity = '0.5';
  link.style.fontSize = '17px';
  link.style.transform = 'scale(0.8)';
  link.style.webkitFilter = 'grayscale(1)';
  
  link.classList.add('tiny');
  destroyLink.parentNode.insertBefore(link, destroyLink);
});