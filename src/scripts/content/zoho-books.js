'use strict';

togglbutton.render(
  '.content-column .btn-toolbar:not(.toggl)',
  { observe: true },
  function (elem) {
    const description = function () {
      let first = $('.pcs-template-body .pcs-label b');
      let second = $('.pcs-template-body #tmp_ref_number');

      first = first ? first.textContent.trim() + ' ' : '';
      second = second ? second.textContent.trim() : '';
      return first + second;
    };

    const project = function () {
      let p = $('.pcs-template-body .pcs-customer-name a');
      p = p ? p.textContent.trim() : '';
      return p;
    };

    const link = togglbutton.createTimerLink({
      className: 'zoho_books',
      description: description,
      projectName: project
    });

    elem.appendChild(link);
  }
);
