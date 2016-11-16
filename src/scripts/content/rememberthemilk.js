/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.b-db-Lm:not(.toggl)', {observe: true}, function (elem) {
    // Execute main function.
    injectTogglButton();

    // Inject toggl button to each task.
    function injectTogglButton() {
        elem.querySelector('.b-db-Lm-xn').appendChild(createTogglButton());
    }

    // Create and return toggl button's instance.
    function createTogglButton() {
        return togglbutton.createTimerLink({
            className: 'rememberthemilk',
            description: getDescription,
            projectName: getProject,
            buttonType: 'minimal'
        });
    }

    // Get task's description.
    function getDescription() {
        return elem.querySelector('.b-db-Lm-xn > .b-db-Lm-Nj').textContent.trim();
    }

    // Get project name if in project task view
    function getProject() {
        var p = $('.b-Mj.b-wd .b-f-n');
        if (!p) {
            return;
        }
        return p.textContent;
    }
});
