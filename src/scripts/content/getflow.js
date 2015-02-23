/*jslint indent: 2 */ 
/*global $: false, document: false, togglbutton: false*/ 
'use strict'; 
togglbutton.render('.content-list-item-label content-list-item:not(.toggl)', {observe: true}, function (elem) { 
  var link, 
    description = $('.content-list-item-name-wrapper', elem).text(), 
    project = $('.context-header-title .copy').text(); 

  link = togglbutton.createTimerLink({ 
    className: 'getflow', 
    description: description, 
    projectName: project 
  }); 

  $('.content-list-item-name-detail-wrapper').prepend(link); 
});