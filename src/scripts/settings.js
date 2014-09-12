/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var Settings = {
  $postPopup: null,
  $socket: null,
  showPage: function () {
    Settings.toggleState(Settings.$postPopup, TogglButton.$showPostPopup);
    Settings.toggleSetting(Settings.$socket, TogglButton.$socket);
  },
  toggleState: function (elem, state) {
    elem.checked = state;
  },
  toggleSetting: function (elem, state, type) {
    var request = {
      type: type,
      state: state
    };
    Settings.toggleState(elem, state);
    chrome.extension.sendMessage(request);
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.$socket = document.querySelector("#websocket");
  Settings.showPage();
  Settings.$postPopup.addEventListener('click', function () {
    Settings.toggleSetting(e.target, (localStorage.getItem("showPostPopup") !== "true"), "toggle-popup");
  });
  Settings.$socket.addEventListener('click', function (e) {
    Settings.toggleSetting(e.target, (localStorage.getItem("socketEnabled") !== "true"), "toggle-socket");
  });
});