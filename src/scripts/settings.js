/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var Settings = {
  $postPopup: null,
  $socket: null,
  $nanny: null,
  $customWebsitesCheckBox: null,
  $customWebsites: null,
  $addNewCustomWebsiteLink: null,
  $restoreCustomWebsitesToDefaultButton: null,
  showPage: function () {
    Settings.setFromTo();
    document.querySelector("#nag-nanny-interval").value = TogglButton.$idleInterval / 60000;
    Settings.toggleCheckBoxState(Settings.$postPopup, TogglButton.$showPostPopup);
    Settings.toggleCheckBoxState(Settings.$nanny, TogglButton.$idleCheckEnabled);
    Settings.toggleCheckBoxState(Settings.$customWebsitesCheckBox, TogglButton.$customWebsitesEnabled);
    Settings.toggleCheckBoxSetting(Settings.$socket, TogglButton.$socket);
    if (typeof TogglButton.$customWebsites !== "undefined"
        && TogglButton.$customWebsites !== null
        && TogglButton.$customWebsites.length > 0) {
      Settings.loadCustomWebsites();
    } else {
      var customWebsitesFromStorageStr = localStorage.getItem("customWebsites");
      if (!customWebsitesFromStorageStr) {
        Settings.restoreCustomWebsitesToDefaultInStorage();
      } else {
        try {
          var customWebsitesFromStorageJSON = JSON.parse(customWebsitesFromStorageStr);
          if (customWebsitesFromStorageJSON.length === 0) {
            Settings.restoreCustomWebsitesToDefaultInStorage();
          } else {
            TogglButton.$customWebsites = customWebsitesFromStorageJSON;
            Settings.loadCustomWebsites();
          }
        } catch (e) { // Malformed JSON found in storage
            Settings.restoreCustomWebsitesToDefaultInStorage();
        }
      }
    }
  },
  setFromTo: function () {
    var fromTo = TogglButton.$idleFromTo.split("-");
    document.querySelector("#nag-nanny-from").value = fromTo[0];
    document.querySelector("#nag-nanny-to").value = fromTo[1];
  },
  toggleCheckBoxState: function (elem, state) {
    elem.checked = state;
  },
  toggleCheckBoxSetting: function (elem, state, type) {
    var request = {
      type: type,
      state: state
    };
    if (elem !== null) {
      Settings.toggleCheckBoxState(elem, state);
    }
    chrome.extension.sendMessage(request);
  },
  saveSetting: function (value, type) {
    Settings.toggleCheckBoxSetting(null, value, type);
  },
  setCustomWebsiteInStorage: function (index, value) {
    var request = {
      type: 'set-custom-website',
      index: index,
      value: value
    };
    chrome.extension.sendMessage(request);
  },
  removeCustomWebsiteFromStorage: function (index) {
    var request = {
      type: 'remove-custom-website',
      index: index
    };
    chrome.extension.sendMessage(request);
  },
  restoreCustomWebsitesToDefaultInStorage: function (index) {
    var request = {
      type: 'restore-custom-websites-to-default'
    };
    chrome.extension.sendMessage(request, function (response) {
      Settings.loadCustomWebsites();
    });
  },
  loadCustomWebsites: function () {
    Settings.clearCustomWebsites();
    for (var i = 0; i < TogglButton.$customWebsites.length; i++) {
      var newCustomWebsiteElem = Settings.addCustomWebsite();
      newCustomWebsiteElem.getElementsByClassName('custom-website-url')[0].value = TogglButton.$customWebsites[i]['url'];
      newCustomWebsiteElem.getElementsByClassName('custom-website-app')[0].value = TogglButton.$customWebsites[i]['app'];
    }
  },
  clearCustomWebsites: function () {
    var customWebsiteListElem = document.querySelector("#custom-website-list");
    customWebsiteListElem.innerHTML = '';
  },
  addCustomWebsite: function () {
    var customWebsiteListElem = document.querySelector("#custom-website-list");
    var newCustomWebsiteElem = document.createElement('li');
    newCustomWebsiteElem.className = 'custom-website';
    newCustomWebsiteElem.innerHTML =
    '<label>' +
      'URL:' +
      '<input type="text" placeholder="Example: internal-website.com/app-folder" class="custom-website-url">' +
    '</label>' +
    '<label>' +
      'App:' +
      '<select class="custom-website-app">' +
        '<option value="AnyDo">Any.do</option>' +
        '<option value="Asana">Asana</option>' +
        '<option value="Basecamp">Basecamp</option>' +
        '<option value="Bitbucket">Bitbucket</option>' +
        '<option value="Capsule">Capsule</option>' +
        '<option value="GitHub">GitHub</option>' +
        '<option value="GitLab">GitLab</option>' +
        '<option value="GoogleDrive">Google Drive</option>' +
        '<option value="PivotalTracker">Pivotal Tracker</option>' +
        '<option value="Podio">Podio</option>' +
        '<option value="Producteev">Producteev</option>' +
        '<option value="Redbooth">Redbooth</option>' +
        '<option value="Redmine">Redmine</option>' +
        '<option value="Sifter">Sifter</option>' +
        '<option value="Teamweek">Teamweek</option>' +
        '<option value="Todoist">Todoist</option>' +
        '<option value="Trac">Trac</option>' +
        '<option value="Trello">Trello</option>' +
        '<option value="Unfuddle">Unfuddle</option>' +
        '<option value="Worksection">Worksection</option>' +
        '<option value="Wunderlist">Wunderlist</option>' +
        '<option value="YouTrack">YouTrack</option>' +
        '<option value="Zendesk">Zendesk</option>' +
      '</select>' +
    '</label>' +
    '<div class="custom-website-remove-button"></div>';
    customWebsiteListElem.appendChild(newCustomWebsiteElem);
    var eventListeners = ['keydown', 'mouseout', 'change'];
    for (var curInputIndex = 0; curInputIndex < 2; curInputIndex++) { // For URL and App inputs
      for (var curEventIndex = 0; curEventIndex < eventListeners.length; curEventIndex++) { // For keyboard, mouse, and generic change events
        newCustomWebsiteElem.children[curInputIndex].addEventListener(eventListeners[curEventIndex], function (e) {
          var newCustomWebsiteIndex = Settings.getElemIndexWithinParent(newCustomWebsiteElem);
          var newCustomWebsiteJSON = {
            'url': newCustomWebsiteElem.children[0].children[0].value,
            'app': newCustomWebsiteElem.children[1].children[0].value
          };
          Settings.setCustomWebsiteInStorage(newCustomWebsiteIndex, newCustomWebsiteJSON);
        });
      }
    }
    newCustomWebsiteElem.children[2].addEventListener('click', function () {
      Settings.removeCustomWebsite(newCustomWebsiteElem);
    });
    return newCustomWebsiteElem;
  },
  removeCustomWebsite: function (customWebsiteElem) {
    var customWebsiteIndex = Settings.getElemIndexWithinParent(customWebsiteElem);
    customWebsiteElem.parentNode.removeChild(customWebsiteElem);
    Settings.removeCustomWebsiteFromStorage(customWebsiteIndex);
  },
  getElemIndexWithinParent: function (elem) {
    for (var i = 0; (elem = elem.previousSibling); i++);
    return i;
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$postPopup = document.querySelector("#show-post-start-popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.$nanny = document.querySelector("#nag-nanny");
  Settings.$customWebsitesCheckBox = document.querySelector("#custom-websites");
  Settings.$addNewCustomWebsiteLink = document.querySelector("#add-new-custom-website-link");
  Settings.$restoreCustomWebsitesToDefaultButton = document.querySelector("#restore-custom-websites-to-default-button");
  Settings.showPage();
  Settings.$postPopup.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("showPostPopup") !== "true"), "toggle-popup");
  });
  Settings.$socket.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("socketEnabled") !== "true"), "toggle-socket");
  });
  Settings.$customWebsitesCheckBox.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("customWebsitesEnabled") !== "true"), "toggle-custom-websites");
  });
  Settings.$addNewCustomWebsiteLink.addEventListener('click', function () {
    Settings.addCustomWebsite();
  });
  Settings.$restoreCustomWebsitesToDefaultButton.addEventListener('click', function () {
    if (confirm('Are you sure you would like to delete all custom websites and restore to default websites?')) {
      Settings.restoreCustomWebsitesToDefaultInStorage();
    }
  });
  Settings.$nanny.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("idleCheckEnabled") !== "true"), "toggle-nanny");
  });
  document.querySelector("#nag-nanny-from").addEventListener('blur', function (e) {
    if (e.target.value.length === 0) {
      Settings.setFromTo();
      return;
    }
    Settings.$fromTo = e.target.value + "-" + document.querySelector('"nag-nanny-to').value;
    Settings.saveSetting();
  });
  document.querySelector("#nag-nanny-to").addEventListener('blur', function (e) {
    if (e.target.value.length === 0) {
      Settings.setFromTo();
      return;
    }
    var fromTo = document.querySelector('#nag-nanny-from').value + "-" + e.target.value;
    Settings.saveSetting(fromTo, "toggle-nanny-from-to");
  });
  document.querySelector("#nag-nanny-interval").addEventListener('blur', function (e) {
    if (e.target.value < 1) {
      e.target.value = 1;
      return;
    }
    Settings.saveSetting((document.querySelector('#nag-nanny-interval').value * 60000), "toggle-nanny-interval");

  });
});