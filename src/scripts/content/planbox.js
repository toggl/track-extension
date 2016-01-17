/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/

"use strict";

togglbutton.render('div.importances:not(.toggl)', {observe: true}, function (elem) {
    var link,
        description = $("#story_name p").innerText,
        projectName = $(".project .name").innerText;

    link = togglbutton.createTimerLink({
        className: "planbox",
        description: description,
        projectName: projectName
    });

    var div = document.createElement("div");
    div.className = "fl";
    div.appendChild(link);

    var importanceDiv = $("div.importances");
    var collectorDiv = importanceDiv.parentNode;
    collectorDiv.insertBefore(div, importanceDiv.nextSibling);
});