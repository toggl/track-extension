/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

// main entity button
togglbutton.render('div.general-info:not(.toggl)', {observe: true}, function (elem) {
    var titleElement = $('.i-role-title', elem);
    var entityIdName = $('.entity-id a', elem).textContent + ' ' + titleElement.textContent;

    var link = togglbutton.createTimerLink({
        className:   'targetprocess',
        description: entityIdName,
        projectName: entityIdName
    });

    titleElement.parentElement.appendChild(link);
});

// entity's task buttons
togglbutton.render('.tau-list__table__row:not(.toggl)', {observe: true}, function (elem) {
    var taskId      = '#' + $('.tau-list__table__cell-id', elem).textContent.trim();
    var taskTitle   = $('.tau-list__table__cell-name', elem).textContent.trim();
    var entityTitle = $('.ui-title_type_main .i-role-title').textContent.trim();
    var entityId    = $('.ui-title_type_main .entity-id').textContent.trim();

    var link = togglbutton.createTimerLink({
        className:   'targetprocess',
        description: taskId + ' ' + taskTitle,
        projectName: entityId + ' ' + entityTitle,
        buttonType:  'minimal'
    });

    var buttonPlaceholder = $('.tau-list__table__cell-state', elem);
    buttonPlaceholder.insertBefore(link, buttonPlaceholder.firstChild);
});

