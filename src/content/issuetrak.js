/**
 * @name Issuetrak
 * @urlAlias issuetrak.com
 * @urlRegex *://*.issuetrak.com/*
 */
'use strict';

/*
 * Issuetrak issue pages are classic server-rendered ASP pages, e.g.
 * /CSIssue_View.asp?IssueNbr=11506. The issue number and the subject are both in
 * the initial HTML, but several React widgets (attachments, bookmark flag,
 * close-as-duplicate) mount into the page title row after load, so the button is
 * attached with an observer.
 *
 * Time entry description: "#11506 - Subject of the issue"
 */

const issuetrakIssueNumber = function () {
  // Every issue URL carries the issue number as a query parameter.
  const fromUrl = new URLSearchParams(window.location.search).get('IssueNbr');
  if (fromUrl !== null && /^\d+$/.test(fromUrl.trim())) {
    return fromUrl.trim();
  }

  // The widgets in the title row expose it as a data attribute.
  const entity = $('#pageTitleContainer [data-entity-id]');
  if (entity !== null) {
    const id = (entity.getAttribute('data-entity-id') || '').trim();
    if (/^\d+$/.test(id)) {
      return id;
    }
  }

  // Last resort: the heading reads "View Issue #11506".
  const heading = $('#pageTitle');
  if (heading !== null) {
    const match = /#(\d+)/.exec(heading.textContent);
    if (match !== null) {
      return match[1];
    }
  }

  return null;
};

const issuetrakSubject = function () {
  // Issue pages keep the unescaped subject in a hidden input.
  const hidden = $('#inp_hiddenSubject');
  if (hidden !== null && hidden.value.trim() !== '') {
    return hidden.value.trim();
  }

  // Fallback: the "Subject:" row of the issue detail table. Only direct text
  // nodes are read, so the hidden inputs in the same cell are ignored.
  const labels = document.querySelectorAll('td.issueLabel');
  for (let i = 0; i < labels.length; i += 1) {
    if (labels[i].textContent.trim().replace(/:$/, '') !== 'Subject') {
      continue;
    }
    const cell = labels[i].nextElementSibling;
    if (cell === null) {
      continue;
    }
    const text = Array.from(cell.childNodes)
      .filter(function (node) {
        return node.nodeType === Node.TEXT_NODE;
      })
      .map(function (node) {
        return node.textContent;
      })
      .join(' ')
      .trim();
    if (text !== '') {
      return text;
    }
  }

  return null;
};

togglbutton.render(
  '#pageTitleContainer:not(.toggl)',
  { observe: true, debounceInterval: 200 },
  function (elem) {
    const number = issuetrakIssueNumber();
    const subject = issuetrakSubject();

    // #pageTitleContainer is present on every Issuetrak page; only issue pages
    // have both a number and a subject.
    if (number === null || subject === null) {
      return;
    }

    const link = togglbutton.createTimerLink({
      className: 'issuetrak',
      description: '#' + number + ' - ' + subject,
    });

    // The title row is a baseline-aligned flex container.
    link.style.alignSelf = 'center';

    elem.appendChild(link);
  },
);
