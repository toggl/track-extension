/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.IZ65Hb-TBnied:not(.toggl)', {observe: true}, function (elem) {
  var link,
    toolbar = $('.IZ65Hb-INgbqf', elem),
    description = $('.IZ65Hb-YPqjbf:not(.LwH6nd)', elem).innerText,
    tagFunc;

  tagFunc = function () {
    var index,
      tags = [],
      tagItems = $('.IZ65Hb-x00ATb', elem).children;

    for (index in tagItems) {
      if (tagItems.hasOwnProperty(index)) {
        tags.push(tagItems[index].textContent);
      }
    }
    return tags;
  };

  link = togglbutton.createTimerLink({
    className: 'keep',
    buttonType: 'minimal',
    description: description,
    projectName: "",
    tags: tagFunc
  });
  toolbar.appendChild(link);
});
