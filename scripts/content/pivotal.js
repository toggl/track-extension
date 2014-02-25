/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

"use strict";


togglbutton.render('form.story:not(.toggl)', {observe: true}, function (elem) {
  var link,
    titleElem = $('textarea', elem),
    container = $('.edit aside', elem);

  if (titleElem === null || container === null) {
    return;
  }

  var getProjectId = function() {
      var sel = $('.toggl-project-select');
      return sel ? sel.value : '';
  };

  link = togglbutton.createTimerLink({
    className: 'pivotal',
    description: titleElem.value,
    projectId: getProjectId
  });

  container.appendChild(link);
});

chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success && response.user && response.user.projects) {

        var togglSelect = createProjectSelect(response.user,'toggl-project-select');

        document.addEventListener('DOMNodeInserted', function() {
            var titleSection = $('section.name h2');
            if (titleSection) {
                titleSection.appendChild(togglSelect);
            }
        });

    }
});

