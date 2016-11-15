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
            description: getDescription(),
            buttonType: 'minimal'
        });
    }

    // Get task's description.
    function getDescription() {
        return elem.querySelector('.b-db-Lm-xn > .b-db-Lm-Nj').textContent.trim();
    }
});
