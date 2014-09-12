/*jslint indent: 2, unparam: true*/
/*global document: false, window: false, XMLHttpRequest: false, chrome: false, btoa: false, localStorage:false */
"use strict";

var TogglButton = chrome.extension.getBackgroundPage().TogglButton;

var Settings = {
  $postPopup: null,
  showPage: function () {
    Settings.toggleEditFormState(TogglButton.$showPostPopup);
  },
  toggleEditFormState: function (state) {
    var request = {
      type: "toggle-popup",
      state: state
    };
    Settings.$postPopup.checked = state;
    chrome.extension.sendMessage(request);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Settings.$postPopup = document.querySelector("#show_post_start_popup");
  Settings.showPage();
  Settings.$postPopup.addEventListener('click', function () {
    Settings.toggleEditFormState(localStorage.getItem("showPostPopup") !== "true");
  });
});