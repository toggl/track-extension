/**
 * @name Xero
 * @urlAlias xero.com
 * @urlRegex '*://*.xero.com/*'
 */
'use strict';

togglbutton.render('.xnav-header--main:not(.toggl)', {}, function (elem) {
  const container = $('.xnav-addons');
  let descriptionNode;

  if ($('#page_title h1')) {
    // Quotes
    // Sales overview
    // Purchase Orders
    // Purchases overview
    // Expense claims
    // Products and services
    descriptionNode = $('#page_title h1');
  } else if ($('#title')) {
    // Invoices
    // Bills
    // Bank account
    // Manual journals
    // Pay Run
    descriptionNode = $('#title');
  } else if ($('.page-title h1')) {
    // Reports child
    descriptionNode = $('.page-title h1').cloneNode(true);
    descriptionNode.removeChild($('span', descriptionNode));
  } else if ($('header.xui-pageheading')) {
    // Dashboard
    // Reports
    // Advanced accounting
    // Projects
    descriptionNode = $('.xui-pageheading');
    // Dashboard
    // Reports
    // Projects
    if ($('h1', descriptionNode)) {
      descriptionNode = $('h1', descriptionNode);
    }
  } else if ($('.fa-pagetitle')) {
    // Fixed assets
    descriptionNode = $('.fa-pagetitle');
  }

  const link = togglbutton.createTimerLink({
    className: 'xero',
    projectName: 'Finance',
    description: descriptionNode ? descriptionNode.textContent.trim() : '',
    buttonType: 'minimal'
  });

  const div = createTag('div', 'xrh-focusable--child xrh-iconwrapper');
  div.appendChild(link);

  const button = createTag('button', 'xnav-header-button xnav-addon--iconbutton xnav-header--iconbutton xnav-focusable--parent');
  button.type = 'button';

  button.addEventListener('click', function (e) {
    e.stopPropagation();
    link.click();
  });

  button.appendChild(div);

  const liTag = createTag('li', 'xnav-addon');
  liTag.appendChild(button);

  if (container) {
    const userIcon = $('[data-automationid="xnav-addon-user"]', container);
    container.insertBefore(liTag, userIcon);
  }
});
