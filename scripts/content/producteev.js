/**
 * Created by lancelothk on 2/16/14.
 */
"use strict";

    togglbutton.render('.task:not(.toggl)', {observe: true}, function (elem) {
    var link,
        titleElem = $('.title > span', elem),
        projectElem = $('.project-value', elem),
        container = $('.task-body > div > div.title', elem);

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
