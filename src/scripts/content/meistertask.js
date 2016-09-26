/*jslint indent: 2 */ 
/*global $: false, document: false, togglbutton: false*/ 
'use strict'; 
togglbutton.render('.js-box-wrapper:not(.toggl)', {observe: true}, function (elem) { 
  var link, 
    description = $('.js-box-wrapper .container-name', elem).textContent, 
    project = $('.container-task-info div[title="Project"]>a', elem).textContent,
    tags = $('.js-box-wrapper .container-labels span', elem).textContent;
  link = togglbutton.createTimerLink({ 
    className: 'meistertask', 
    description: description, 
    projectName: project,
    tags: tags 
  }); 

  $('.js-task-header>div>row>cell:nth-child(5)').prepend(link); 
});
