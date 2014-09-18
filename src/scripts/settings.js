/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var Settings = {
  $postPopup: null,
  $socket: null,
  $customWebsites: null,
  showPage: function () {
    Settings.toggleCheckBoxState(Settings.$postPopup, TogglButton.$showPostPopup);
    Settings.toggleCheckBoxSetting(Settings.$socket, TogglButton.$socket);
    Settings.setTextAreaValue(Settings.$customWebsites, TogglButton.$customWebsites);
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
  setTextAreaValue: function (elem, value) {
    elem.value = value;
  },
  setTextAreaSetting: function (elem, value, type) {
    var request = {
      type: type,
      value: value
    };
    Settings.setTextAreaValue(elem, value);
    chrome.extension.sendMessage(request);
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
        '<option value="AnyDo">AnyDo</option>' +
        '<option value="Asana">Asana</option>' +
        '<option value="Basecamp">Basecamp</option>' +
        '<option value="BitBucket">BitBucket</option>' +
        '<option value="CapsuleCRM">CapsuleCRM</option>' +
        '<option value="GitHub">GitHub</option>' +
        '<option value="GitLab">GitLab</option>' +
        '<option value="GoogleDocs">GoogleDocs</option>' +
        '<option value="PivotalTracker">PivotalTracker</option>' +
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
        '<option value="WorkSection">WorkSection</option>' +
        '<option value="YouTrack">YouTrack</option>' +
        '<option value="ZenDesk">ZenDesk</option>' +
      '</select>' +
    '</label>' +
    '<div class="website_remove_button"></div>';
    websiteListElem.appendChild(newWebsiteElem);
    newWebsiteElem.children[2].addEventListener('click', function () {
      Settings.removeWebsite(newWebsiteElem);
    });
    return newWebsiteElem;
  },
  removeWebsite: function (websiteWrapperElem) {
    websiteWrapperElem.parentNode.removeChild(websiteWrapperElem);
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.$customWebsites = document.querySelector("#custom_websites");
  Settings.showPage();
  Settings.$postPopup.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("showPostPopup") !== "true"), "toggle-popup");
  });
  Settings.$socket.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("socketEnabled") !== "true"), "toggle-socket");
  });
  var customWebsitesEventListeners = ['keydown', 'mouseout'];
  for (var i = 0; i < customWebsitesEventListeners.length; i++) {
    Settings.$customWebsites.addEventListener(customWebsitesEventListeners[i], function (e) {
      Settings.setTextAreaSetting(e.target, Settings.$customWebsites.value, 'setCustomWebsitesValue');
    });
  }
  document.querySelector('#add_new_website_link').addEventListener('click', function () {
    Settings.addWebsite();
  });
  for(var i = 0; i < TogglButton.$defaultWebsitesJSON.length; i++){
    var newWebsiteElem = Settings.addWebsite();
    newWebsiteElem.getElementsByClassName('website_url')[0].value = TogglButton.$defaultWebsitesJSON[i]['url'];
    newWebsiteElem.getElementsByClassName('website_app')[0].value = TogglButton.$defaultWebsitesJSON[i]['app'];
  }
  var websiteRemoveLinks = document.getElementsByClassName('website_remove_link');
  for(var i = 0; i < websiteRemoveLinks.length; i++){
    websiteRemoveLinks[i].addEventListener('click', function (e) {
      Settings.removeWebsite(e.target.parentNode.parentNode);
    });
  }
});