/*jslint indent: 2, unparam: true*/
/*global $: false, document: false, togglbutton: false*/
'use strict';

togglbutton.render('.subheader-status .subheader-content', {}, function (elem) {
  var link, description, project, company,
    titleElem = $('.subheader-content h2'),
    projectElem = $('#header h1'),
    companyElem = $('#header h1 .company');

  description = titleElem.innerText;
  project = projectElem.textContent;
  company = companyElem.textContent;
  project = project.substring(0, project.length - company.length - 1);

  link = togglbutton.createTimerLink({
    className: 'sifterapp',
    description: description,
    projectName: project
  });

  $('.subheader-content h2').appendChild(link);
});
