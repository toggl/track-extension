/**
 * Created by Arielb on 3/1/2015.
 */
/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';
togglbutton.render('.wrap h2:not(.toggl)', {observe: true}, function (elem) {
    var link,container=createTag('div', 'localhost-toggl-button'),
        description = elem.innerText,
        project = document.title;
    link = togglbutton.createTimerLink({
        className: 'wp-admin-toggl',
        description: project,
        projectName: project
    });

    container.insertBefore(link,container.childNodes[0]);
    elem.appendChild(container);
});