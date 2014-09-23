/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var Settings = {
  $postPopup: null,
  $socket: null,
  $addWebsiteLink: null,
  $restoreDefaultWebsitesButton: null,
  showPage: function () {
    Settings.toggleCheckBoxState(Settings.$postPopup, TogglButton.$showPostPopup);
    Settings.toggleCheckBoxSetting(Settings.$socket, TogglButton.$socket);
    if (TogglButton.$websites) {
        Settings.loadWebsites();
    } else {
      var websitesFromStorageStr = localStorage.getItem("websites");
      if (!websitesFromStorageStr) {
        Settings.restoreDefaultWebsitesInStorage();
      } else {
        var websitesFromStorageJSON = JSON.parse(websitesFromStorageStr);
        if (websitesFromStorageJSON.length === 0) {
          Settings.restoreDefaultWebsitesInStorage();
        } else {
          TogglButton.$websites = websitesFromStorageJSON;
          Settings.loadWebsites();
        }
      }
    }
  },
  toggleCheckBoxState: function (elem, state) {
    elem.checked = state;
  },
  toggleCheckBoxSetting: function (elem, state, type) {
    var request = {
      type: type,
      state: state
    };
    Settings.toggleCheckBoxState(elem, state);
    chrome.extension.sendMessage(request);
  },
  setWebsiteInStorage: function (index, value) {
    var request = {
      type: 'setWebsite',
      index: index,
      value: value
    };
    chrome.extension.sendMessage(request);
  },
  removeWebsiteFromStorage: function (index) {
    var request = {
      type: 'removeWebsite',
      index: index
    };
    chrome.extension.sendMessage(request);
  },
  restoreDefaultWebsitesInStorage: function (index) {
    var request = {
      type: 'restoreDefaultWebsites'
    };
    chrome.extension.sendMessage(request, function (response) {
      Settings.loadWebsites();
    });
  },
  loadWebsites: function () {
    Settings.clearWebsites();
    for (var i = 0; i < TogglButton.$websites.length; i++) {
      var newWebsiteElem = Settings.addWebsite();
      newWebsiteElem.getElementsByClassName('website_url')[0].value = TogglButton.$websites[i]['url'];
      newWebsiteElem.getElementsByClassName('website_app')[0].value = TogglButton.$websites[i]['app'];
    }
  },
  clearWebsites: function () {
    var websiteListElem = document.querySelector("#website_list");
    websiteListElem.innerHTML = '';
  },
  addWebsite: function () {
    var websiteListElem = document.querySelector("#website_list");
    var newWebsiteElem = document.createElement('li');
    newWebsiteElem.className = 'website';
    newWebsiteElem.innerHTML =
    '<label>' +
      'URL:' +
      '<input type="text" placeholder="Example: internal-website.com/app-folder" class="website_url">' +
    '</label>' +
    '<label>' +
      'App:' +
      '<select class="website_app">' +
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
        '<option value="YouTrack">YouTrack</option>' +
        '<option value="Zendesk">Zendesk</option>' +
      '</select>' +
    '</label>' +
    '<div class="website_remove_button"></div>';
    websiteListElem.appendChild(newWebsiteElem);
    var eventListeners = ['keydown', 'mouseout', 'change'];
    for (var curInputIndex = 0; curInputIndex < 2; curInputIndex++) { // For URL and App inputs
      for (var curEventIndex = 0; curEventIndex < eventListeners.length; curEventIndex++) { // For keyboard, mouse, and generic change events
        newWebsiteElem.children[curInputIndex].addEventListener(eventListeners[curEventIndex], function (e) {
          var newWebsiteIndex = Settings.getElemIndexWithinParent(newWebsiteElem);
          var newWebsiteJSON = {
            'url': newWebsiteElem.children[0].children[0].value,
            'app': newWebsiteElem.children[1].children[0].value
          };
          Settings.setWebsiteInStorage(newWebsiteIndex, newWebsiteJSON);
        });
      }
    }
    newWebsiteElem.children[2].addEventListener('click', function () {
      Settings.removeWebsite(newWebsiteElem);
    });
    return newWebsiteElem;
  },
  removeWebsite: function (websiteElem) {
    var websiteIndex = Settings.getElemIndexWithinParent(websiteElem);
    websiteElem.parentNode.removeChild(websiteElem);
    Settings.removeWebsiteFromStorage(websiteIndex);
  },
  getElemIndexWithinParent: function (elem) {
    for (var i = 0; (elem = elem.previousSibling); i++);
    return i;
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.$addWebsiteLink = document.querySelector("#add_new_website_link");
  Settings.$restoreDefaultWebsitesButton = document.querySelector("#restore_default_websites_button");
  Settings.showPage();
  Settings.$postPopup.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("showPostPopup") !== "true"), "toggle-popup");
  });
  Settings.$socket.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("socketEnabled") !== "true"), "toggle-socket");
  });
  Settings.$addWebsiteLink.addEventListener('click', function () {
    Settings.addWebsite();
  });
  Settings.$restoreDefaultWebsitesButton.addEventListener('click', function () {
    Settings.restoreDefaultWebsitesInStorage();
  });
});