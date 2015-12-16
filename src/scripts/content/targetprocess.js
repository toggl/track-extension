/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// main entity button
togglbutton.render('div.general-info:not(.toggl)', {observe: true}, function (elem) {
    var titleElement = $('.i-role-title', elem);

    var link, entityIdName;

    entityIdName = $('.entity-id a', elem).textContent + ' ' + titleElement.textContent;

    link = togglbutton.createTimerLink({
        className:   'targetprocess',
        description: entityIdName,
        projectName: entityIdName
    });

    titleElement.parentElement.appendChild(link);
});

// entity's task buttons
togglbutton.render('.tau-list__table__row:not(.toggl)', {observe: true}, function (elem) {
    var link, entityIdName;
    var entityId = '#' + $('.tau-list__table__cell-id', elem).textContent.trim();
    var entityTitle = $('.tau-list__table__cell-name', elem).textContent.trim();

    entityIdName = entityId + ' ' + entityTitle;

    link = togglbutton.createTimerLink({
        className:   'targetprocess',
        description: entityIdName,
        projectName: entityIdName,
        buttonType:  'minimal'
    });

    $('.tau-list__table__cell-state', elem).appendChild(link);
});

