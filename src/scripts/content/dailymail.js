/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#js-article-text:not(.toggl)', {observe:true}, function (elem) {  
  /* Use the H1 under js-article-text */
  var objs = elem.getElementsByTagName('H1');
  
  if (objs.length > 0) {
	var h1 = objs[0];
	var link,
		description = h1.textContent,
		project = "DailyMail";

	link = togglbutton.createTimerLink({
		className: 'dailymail',
		description: description,
		projectName: project
	});
	h1.appendChild(link);
  }
});
