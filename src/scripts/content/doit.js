/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

var container = '[id^=taskview_task_]:not(.toggl)';

togglbutton.render(container, {observe: true}, function (elem) {
  var titleElem   = $('h3 > span.title.ng-binding',elem);
  var projectElem = $('div > div.item.project.ng-binding',elem);

  var  description = titleElem != null ? titleElem.innerHTML :''; 
  var  project = projectElem != null ? projectElem.innerHTML : '';

  if ( description != '' ) {
    titleElem.innerHTML = description + ' ' ;
  }
 
  if ( project != '' ) {
    project = project.substring(1);  // remove '#'
  }

  var link = togglbutton.createTimerLink({
    className: 'doit',
    description: description,
    projectName: project
  });
  var firstOp = $('li.task-op').children[0]; 
  $('li.task-op').insertBefore(link,firstOp);
});


togglbutton.render('#taskform > div > div.taskform-main:not(.toggl)', {observe: true}, function (elem) {
  var titleElem   = $('li.meta.task-title > div > div > div.textarea-tmp',elem);
  var projectElem = $('li.meta.task-project.smart > div > div > ul > li.token > div',elem);

  var  description = titleElem != null ? titleElem.innerHTML :''; 
  var  project = projectElem != null ? projectElem.innerHTML : '';

  var link = togglbutton.createTimerLink({
    className: 'doit',
    description: description,
    projectName: project
  });

  titleElem.parentElement.appendChild(link);
});
