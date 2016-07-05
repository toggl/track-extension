/*jslint indent: 2 */
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('#ctl00_ctl00_PageBody_tktHeader', {}, function (elem) {
  var link,
    description  = '',
    project = '';   

	var object = $('#ctl00_ctl00_PageBody_lbSubject');	
	description = $('#ctl00_ctl00_PageBody_lbSubject').innerText;
	var returnPos = description.indexOf('\n');
	if (returnPos>0) {
		description = description.substr(0, description.indexOf('\n')); 
	}
	
  link = togglbutton.createTimerLink({
    className: 'sherpadesk',
    description: description,
	projectName: project
  });
	
  link.setAttribute('style', 'line-height: 20px;vertical-align: middle;');

  object.parentElement.appendChild(link);
});
