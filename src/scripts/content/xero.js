'use strict';

togglbutton.render('.xrh-header--main:not(.toggl)', {}, function(elem) {
  var link,
    liTag,
    button,
    div,
    descriptionNode,
    container = $('.xrh-addons');

  // Quotes
  // Sales overview
  // Purchase Orders
  // Purchases overview
  // Expense claims
  // Products and services
  if ($('#page_title h1')) {
    descriptionNode = $('#page_title h1');
  }
  // Invoices
  // Bills
  // Bank account
  // Manual journals
  // Pay Run
  else if ($('#title')) {
    descriptionNode = $('#title');
  }
  // Reports child
  else if ($('.page-title h1')) {
    descriptionNode = $('.page-title h1').cloneNode(true);
    descriptionNode.removeChild($('span', descriptionNode));
  }
  // Dashboard
  // Reports
  // Advanced accounting
  // Projects
  else if ($('header.xui-pageheading')) {
    descriptionNode = $('.xui-pageheading');
    // Dashboard
    // Reports
    // Projects
    if ($('h1', descriptionNode)) {
      descriptionNode = $('h1', descriptionNode);
    }
  }
  // Fixed assets
  else if ($('.fa-pagetitle')) {
    descriptionNode = $('.fa-pagetitle');
  }


  link = togglbutton.createTimerLink({
    className: 'xero',
    projectName: 'Finance',
    description: descriptionNode ? descriptionNode.textContent.trim() : '',
    buttonType: 'minimal'
  });


  div = createTag('div', 'xrh-focusable--child xrh-iconwrapper');
  div.appendChild(link);

  button = createTag('button', 'xrh-button xrh-addon--iconbutton xrh-header--iconbutton xrh-focusable--parent');
  button.type = 'button';

  button.addEventListener('click', function(e) {
    e.stopPropagation();
    link.click();
  });

  button.appendChild(div);

  liTag = createTag('li', 'xrh-addon');
  liTag.appendChild(button);

  if (container) {
    var userIcon = $('[data-automationid="xrh-addon-user"]', container);
    container.insertBefore(liTag, userIcon);
  }
});
