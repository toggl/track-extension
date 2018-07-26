'use strict';

togglbutton.render('.js-box-wrapper:not(.toggl)', {observe: true}, function (elem) {
  var link, description, togglButtonElement, project, tagFunc;

  togglButtonElement = $('.js-task-header>div>row>cell:nth-child(5)', elem);
  description = $('.js-box-wrapper .container-name .js-task-name>div', elem).textContent;
  project = $('.js-project-name').textContent;

  tagFunc = function () {
    var index,
      tags = [],
      tagList = $('.js-box-wrapper .ui-tag', elem),
      tagItems;

    if (!tagList) {
      return [];
    }

    tagItems = tagList.children;

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

  togglButtonElement.parentNode.insertBefore(link, togglButtonElement);
});
