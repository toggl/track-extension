/*jslint indent: 2 */
/*global window: false, document: false, chrome: false, $: false, createTag: false, createLink: false*/
(function () {
  "use strict";

  var CURRENT_REPO = getCurrentRepo();
  if (CURRENT_REPO === null) return;
  var DEFAULT_SETTINGS = {
    'projectMappings': {}
  }

  var settings = null, user = null;

  function createTimerLink(task, moreClass) {
    var link = createLink('toggl-button with-toggl-icon ' + moreClass);
    link.addEventListener("click", function (e) {
      chrome.extension.sendMessage({
        type: 'timeEntry',
        description: task,
        pid: settings.projectMappings[CURRENT_REPO]
      });
      link.innerHTML = "Started...";
    });
    return link;
  }

  function addLinkToDiscussion() {
    var titleElem = $('.discussion-topic-title'), numElem, title, wrap;
    if (titleElem === null) {
      return;
    }

    numElem = $('.pull-head .pull-number > a, .issue-head .number > strong');
    title = titleElem.innerHTML;
    if (numElem !== null) {
      title = numElem.innerHTML + " " + title;
    }

    wrap = createTag('div', 'toggl infobar-widget');
    wrap.appendChild(createTimerLink(title, 'button minibutton'));
    $(".discusion-topic-infobar").appendChild(wrap);
  }
  
  function addProjectSelector() {
    var container = $('.pagehead-actions').appendChild(
        createTag('li', 'toggl-select-project button-group'));
    container.appendChild(createTag('label', 'minibutton with-toggl-icon', "Project"))
        .setAttribute('for', 'toggl-project-list');

    container.appendChild(
        createProjectSelector(user, settings.projectMappings[CURRENT_REPO], onChooseProject))
            .className += ' minibutton';
  }

  function getCurrentRepo() {
    return $('.js-current-repository').href.replace(new RegExp('^.*?://'), '');
  }

  function onChooseProject(newPid) {
    //console.log("set project: ", newPid);
    if (newPid >= 0) {
      settings.projectMappings[CURRENT_REPO] = newPid;
    } else {
      delete settings.projectMappings[CURRENT_REPO];
    }
    chrome.storage.sync.set(settings);
    console.log("settings: ", settings);
  }
  
  chrome.extension.sendMessage({type: 'activate'}, function (response) {
    if (response.success) {
      user = response.user;
      chrome.storage.sync.get(DEFAULT_SETTINGS, function(loadedSettings) {
        settings = loadedSettings;
        addProjectSelector();
      }); 

      addLinkToDiscussion();

      //TODO Bind to sync changes so we can keep settings up to date.
    }
  });

}());
