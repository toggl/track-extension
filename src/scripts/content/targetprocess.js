/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('div.general-info:not(.toggl)', {observe: true}, function(elem) {
    var titleElement = $('.i-role-title', elem);

    var link, entityIdName;

    entityIdName = $('.entity-id a', elem).textContent + ' ' + titleElement.textContent;

    link = togglbutton.createTimerLink({
        className: 'targetprocess',
        description: entityIdName,
        projectName: entityIdName
    });

    titleElement.parentElement.appendChild(link);
});

