'use strict';

togglbutton.render('#headerContainer:not(.toggl)',
  { observe: true },
  function (elem) {
    const getDescription = function () {
      // entity: incident
      const ticketnumber = $('input[data-id="ticketnumber.fieldControl-text-box-text"]');
      const ticketname = $('input[data-id="title.fieldControl-text-box-text"]');
      if ((ticketnumber) || (ticketname)) {
        return (ticketnumber ? ticketnumber.title + ' ' : '') + (ticketname ? ticketname.title : '');
      } else {
        // other entities
        const header = $('#headerContainer');
        if (!header) {
          return '';
        }
        const title = $('h1', header);
        if (!title) {
          return '';
        }
        return (title ? title.textContent : '');
      }
    };
    const getProjectName = function () {
      // entity: incident
      const customername = $('li[data-id="customerid.fieldControl-LookupResultsDropdown_customerid_selected_tag"]');
      return (customername ? customername.textContent : '');
    };
    const link = togglbutton.createTimerLink({
      className: 'dynamics365',
      description: getDescription,
      projectName: getProjectName
    });
    elem.appendChild(link);
  });
