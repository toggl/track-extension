'use strict';

togglbutton.render('.js-box-wrapper:not(.toggl)', { observe: true }, function(
  elem
) {
  var link, description, togglButtonElement, project, tagFunc;

  togglButtonElement = $('.js-task-header>div>row>cell:nth-child(5)', elem);
  description = $('.js-box-wrapper .container-name .js-task-name>div', elem)
    .textContent;
  project = $('.js-project-name').textContent;

  tagFunc = function() {
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

// MeisterTask 2.0 (2018)
// since they removed all descriptive classes selectors looks awful
togglbutton.render('.kr-view.react-dialog-box > .kr-view:not(.toggl)', { observe: true }, function (elem) {
  var link, description, project, tagFunc, togglButtonElement;

  description = $('div.react-modals-enable-events > div > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div', elem).textContent;
  project = $('div.react-modals-enable-events > div > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > a', elem).textContent;

  tagFunc = function () {
    var index,
      tags = [],
      tagList = $('div.react-modals-enable-events > div > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2)', elem),
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
  }

  link = togglbutton.createTimerLink({
    className: 'meistertask',
    description: description,
    projectName: project,
    tags: tagFunc,
    buttonType: 'minimal'
  });

  togglButtonElement = $('div.react-modals-enable-events > div > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div:nth-child(2)', elem);

  togglButtonElement.parentNode.insertBefore(link, togglButtonElement);
});
