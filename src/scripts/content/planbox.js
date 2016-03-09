/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

"use strict";

togglbutton.render('div.importances:not(.toggl)', {observe: true}, function () {
  var link,
    description = $("#story_name p").innerText,
    projectName = $(".project .name").innerText,
    div = document.createElement("div"),
    importanceDiv = $("div.importances"),
    collectorDiv = importanceDiv.parentNode;

  div.className = "fl";

  link = togglbutton.createTimerLink({
    className: "planbox",
    description: description,
    projectName: projectName
  });

  div.appendChild(link);
  collectorDiv.insertBefore(div, importanceDiv.nextSibling);
});