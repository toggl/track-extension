/*jslint indent: 2 */ 
/*global $: false, document: false, togglbutton: false*/ 
'use strict'; 

togglbutton.render('.js-box-wrapper:not(.toggl)', {observe: true}, function (elem) {
  var link, description, togglButtonElement, project, tagFunc;

  togglButtonElement = $('.js-task-header>div>row>cell:nth-child(5)', elem);
  description = $('.js-box-wrapper .container-name', elem).textContent;
  project = $('.js-box-wrapper div[title="Project"]>a', elem).textContent;

  tagFunc = function () {
    var index,
      tags = [],
      tagItems = $('.js-box-wrapper .ui-tag', elem).children;

    for (index in tagItems) {
      if (tagItems.hasOwnProperty(index)) {
        tags.push(tagItems[index].textContent);
      }
    }
    return tags;
  };

  link = togglbutton.createTimerLink({
    className: 'meistertask',
    description: description,
    projectName: project,
    tags: tagFunc,
    buttonType: 'minimal'
  });

  togglButtonElement.prepend(link);
});


