/*jslint indent: 2 */
/*global document: false, chrome: false, $: false, createLink: false, createProjectSelect: false*/

(function () {
    "use strict";
    var iframeRegex = /oauth2relay/, userData = null,
        selectedProjectId = null, selectedProjectBillable = false;

    function createTimerLink(taskName) {
        var link = createLink('toggl-button teambox');
        link.addEventListener("click", function (e) {
            chrome.extension.sendMessage({
                type: 'timeEntry',
                description: taskName,
                projectId: selectedProjectId,
                billable: selectedProjectBillable
            });
            link.innerHTML = "Started...";
            return false;
        });
        return link;
    }

    function addButton(e) {
        if (e.target.className === "ghx-detail-issue" || iframeRegex.test(e.target.name)) {
            var sidebar = e.target,
                project = sidebar.querySelector('.ghx-key-group .ghx-project').innerHTML.toLowerCase(),
                detailsTab = sidebar.querySelector('#ghx-tab-details'),
                task = sidebar.querySelectorAll('.ghx-detail-description.ghx-fieldtype-textarea.ghx-fieldname-summary')[0].innerHTML;

            var projectSelect = createProjectSelect(userData, "toggl-select teambox"),
                options = projectSelect.options;

            //make sure we init the values when switching between tasks
            selectedProjectId = null;
            selectedProjectBillable = false;

            projectSelect.onchange = function (event) {
                selectedProjectId = parseInt(event.target.options[event.target.selectedIndex].value);
                if (selectedProjectId !== "default") {
                    var filtered = userData.projects.filter(function (elem, index, array) {
                        return (elem.id === selectedProjectId);
                    });
                    selectedProjectBillable = filtered[0].billable;
                } else {
                    selectedProjectId = null;
                    selectedProjectBillable = false;
                }
            };

            // try to select the right project
            for (var i = 0; i < options.length; i++) {
              if (options[i].getAttribute('data-project-name') && options[i].getAttribute('data-project-name').toLowerCase() == project) {
                options[i].selected = true;
                // trigger change event
                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', false, true);
                projectSelect.dispatchEvent(event);
              }
            }

            detailsTab.parentNode.insertBefore(createTimerLink(task), detailsTab);
            detailsTab.parentNode.insertBefore(projectSelect, detailsTab);
        }
    }

    chrome.extension.sendMessage({type: 'activate'}, function (response) {
        if (response.success) {
            userData = response.user;
            document.addEventListener("DOMNodeInserted", addButton);
        }
    });

}());
