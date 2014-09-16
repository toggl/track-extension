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
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.$customWebsites = document.querySelector("#custom_websites");
  Settings.showPage();
  Settings.$postPopup.addEventListener('click', function () {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("showPostPopup") !== "true"), "toggle-popup");
  });
  Settings.$socket.addEventListener('click', function (e) {
    Settings.toggleCheckBoxSetting(e.target, (localStorage.getItem("socketEnabled") !== "true"), "toggle-socket");
  });
  var customWebsitesEventListeners = ['keydown', 'mouseout'];
  for (var i = 0; i < customWebsitesEventListeners.length; i++) {
    Settings.$customWebsites.addEventListener(customWebsitesEventListeners[i], function (e) {
      Settings.setTextAreaSetting(e.target, Settings.$customWebsites.value, "setCustomWebsitesValue");
    });
  }
});