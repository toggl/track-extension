/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#phabricator-standard-page-body .phui-header-header:not(.toggl)', {observe: true}, function (elem) {
    var crumb = $('.phabricator-last-crumb .phui-crumb-name');
    if (!crumb) {
        return;
    }
    if (!elem.nextSibling || !elem.nextSibling.classList || !elem.nextSibling.classList.contains('phui-header-subheader')) {
        return;
    }

    var taskId = crumb.textContent.trim();
    var link, taskName = elem.textContent.trim();

    var description = taskId + ' ' + taskName;

    link = togglbutton.createTimerLink({
        className: 'phabricator',
        description: description
    });
    link.style.marginLeft = '10px';

    elem.parentNode.insertBefore(link, elem.nextSibling);
});

togglbutton.render('.aphront-dialog-view .phui-header-header:not(.toggl)', {observe: true}, function (elem) {
    var link,
        taskName = elem.textContent.trim();

    if (taskName.substr(0, 6) == "Edit T") {
        taskName = taskName.substr(5);
    }

    link = togglbutton.createTimerLink({
        className: 'phabricator',
        description: taskName
    });
    link.style.marginLeft = '10px';

    elem.parentNode.appendChild(link);
});
