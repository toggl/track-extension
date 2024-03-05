'use strict';
/**
 * @name FreshService
 * @urlAlias freshservice.com
 * @urlRegex *://*.freshservice.com/*
 */

// Main function
togglbutton.render('.tkt-quick-action:not(.toggl)', { observe: true }, function (elem) {
  const titleElem = $('.summary-content .subject-text');
  const idElem = $('.ticket-details-breadcrumb h3');
  const id = idElem.textContent.replace('#','');
  const description = id.trim() + ' ' + titleElem.textContent.trim();
  
  const link = togglbutton.createTimerLink({
    className: 'freshservice',
    description: description,
    projectname: '',
  });
	
  	elem.prepend(link);
  }
);
