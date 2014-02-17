/**
 * Created by lancelothk on 2/16/14.
 */
"use strict";

    togglbutton.render('.row-fluid:not(.toggl)', {observe: true}, function (elem) {
    debugger;
    var link,
        titleElem = $('.span6 > .task.active', elem),
        projectElem = $('.span6 > .task.active', elem),
        container = $('.span7 > #task-details-container', elem);

    if (titleElem === null || container === null) {
        return;
    }
    link = togglbutton.createTimerLink({
        className: 'producteev',
        description: titleElem.title,
        projectName: projectElem.title
    });

    container.appendChild(link);
});
