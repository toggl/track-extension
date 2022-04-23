'use strict';

/**
 * @name Crowdin
 * @urlAlias crowdin.com
 * @urlRegex *://*.crowdin.com/*
 */
togglbutton.render('#panes-controller:not(.toggl)', { observe: true }, function () {
    function getProjectName() {
        let titleParts = document.title.split('-');

        if (titleParts.length == 3) {
            return titleParts[1].trim();
        }

        return undefined;
    }

    const fileName = document.querySelector('.file-name-wrapper .file-name');
    const languageName = document.querySelector('span.language-name-wrapper');
    const workflowStep = document.querySelector('.workflow-name-wrapper');
    const projectName = getProjectName();

    let descriptionParts = [];

    projectName && descriptionParts.push(projectName);
    fileName && descriptionParts.push(fileName.textContent.trim());
    languageName && descriptionParts.push(languageName.textContent.trim());
    workflowStep && descriptionParts.push(workflowStep.textContent.trim());

    const link = togglbutton.createTimerLink({
        className: 'crowdin',
        description: descriptionParts.join(', '),
        projectName: projectName,
        buttonType: 'minimal'
    });

    const trackingButton = document.createElement('button');
    trackingButton.classList.add('btn', 'btn-icon', 'pane-toggler', 'pane-toggler-right');
    trackingButton.style.width = '34px';
    trackingButton.style.height = '34px';
    trackingButton.appendChild(link);

    $('#panes-controller').prepend(trackingButton);
});
