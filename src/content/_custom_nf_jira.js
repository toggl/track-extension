/// START JIRA

togglbutton.render(
  '#ghx-detail-view [spacing] h1:not(.toggl)',
  { observe: !0 },
  function () {
    debugger;
    ({}).DEBUG && console.info('\u{1F3C3} "Jira 2017 sidebar" rendering');
    const n = $('#ghx-detail-view'),
      t = createTag('div', 'jira-ghx-toggl-button'),
      i = $('[spacing] h1', n),
      e = $('[spacing] a', n),
      o = $('.bgdPDV');
    let r = i.textContent;
    e !== null && (r = e.textContent + ' ' + r);
    const a = togglbutton.createTimerLink({
      className: 'jira2017',
      description: r,
      buttonType: 'minimal',
      taskId: (o, i) => {
        return extractTaskId(ExtractNFJiraTogglTaskId(), o, i);
      },
      projectName: (o, i) => {
        return extractProjectName(ExtractNFJiraTogglTaskId(), o, i);
      },
    });
    t.appendChild(a), e.parentNode.appendChild(t);
  }
);

togglbutton.render('#title-heading:not(.toggl)', { observe: !0 }, function (n) {
  const i = $('[id="title-text"]', n).textContent.trim(),
    e = togglbutton.createTimerLink({
      className: 'confluence',
      description: i,
      taskId: (o, i) => {
        return extractTaskId(ExtractNFJiraTogglTaskId(), o, i);
      },
      projectName: (o, i) => {
        return extractProjectName(ExtractNFJiraTogglTaskId(), o, i);
      },
    });
  $('#title-text').appendChild(e);
});

//JIRA Issue View
togglbutton.render(
  '.issue-header-content:not(.toggl)',
  { observe: !0 },
  function (n) {
    debugger;
    ({}).DEBUG && console.info('\u{1F3C3} "Jira 2017 issue page" rendering');
    const t = $('#key-val', n),
      i = $('#summary-val', n) || '';
    let e = $('.bgdPDV'),
      o;
    i && (o = i.textContent.trim()),
      t !== null && (o && (o = ' ' + o), (o = t.textContent + o)),
      e === null &&
        (e = $(
          '[data-test-id="navigation-apps.project-switcher-v2"] button > div:nth-child(2) > div'
        )),
      e === null && (e = $('#project-name-val'));

    const r = togglbutton.createTimerLink({
      className: 'jira2017',
      description: o,
      taskId: (o, i) => {
        return extractTaskId(ExtractNFJiraTogglTaskId(), o, i);
      },
      projectName: (o, i) => {
        return extractProjectName(ExtractNFJiraTogglTaskId(), o, i);
      },
    });
    r.style.marginLeft = '8px';
    const a =
      ($('.issue-link') || {}).parentElement ||
      ($('.aui-nav li') || {}).lastElementChild;
    a && a.appendChild(r);
  }
);

//JIRA Board Detail
togglbutton.render(
  '#ghx-detail-issue:not(.toggl)',
  { observe: !0 },
  function (n) {
    debugger;
    const t = createTag('div', 'ghx-toggl-button'),
      i = $('[data-field-id="summary"]', n),
      e = $('.ghx-fieldname-issuekey a'),
      o = $('.ghx-project', n);
    let r = i.textContent;
    e !== null && (r = e.textContent + ' ' + r);
    const a = togglbutton.createTimerLink({
      className: 'jira',
      description: r,
      taskId: (o, i) => {
        return extractTaskId(ExtractNFJiraTogglTaskId(), o, i);
      },
      projectName: (o, i) => {
        return extractProjectName(ExtractNFJiraTogglTaskId(), o, i);
      },
    });
    t.appendChild(a), $('#ghx-detail-head').appendChild(t);
  }
);

// JIRA Issue List Issue View
togglbutton.render(
  '.issue-header-content:not(.toggl)',
  { observe: !0 },
  function (n) {
    debugger;
    let t;
    const i = $('#key-val', n),
      e = $('#summary-val', n) || '',
      o = $('#project-name-val', n);
    e && (t = e.textContent),
      i !== null && (t && (t = ' ' + t), (t = i.textContent + t));
    const r = togglbutton.createTimerLink({
        className: 'jira',
        description: t,
        taskId: (o, i) => {
          return extractTaskId(ExtractNFJiraTogglTaskId(), o, i);
        },
        projectName: (o, i) => {
          return extractProjectName(ExtractNFJiraTogglTaskId(), o, i);
        },
      }),
      a = createTag('ul', 'toolbar-group'),
      s = createTag('li', 'toolbar-item');
    s.appendChild(r), a.appendChild(s), $('.toolbar-split-left').appendChild(a);
  }
);
//// END JIRA

////START HELPER
const ExtractNFJiraTogglTaskId = () => {
  let e = '';
  const t = document.querySelector('#customfield_10206-val');
  let ret =
    (t && (e && (e += ' '), (e += t.textContent.trim())),
    e.split('-')[0].trim());
  return ret.length > 0 ? ret : null;
};

function extractTaskId(nfTogglTask, projects, tasks) {
  if (nfTogglTask === null) {
    return {};
  }
  const n = Object.keys(tasks).filter((o) =>
      tasks[o].name.startsWith(nfTogglTask)
    ),
    s = n.length > 0 ? tasks[n[0]].id : {};
  return s;
}

function extractTaskProjectId(nfTogglTask, projects, tasks) {
  debugger;
  if (nfTogglTask === null) {
    return null;
  }
  const n = Object.keys(tasks).filter((o) =>
      tasks[o].name.startsWith(nfTogglTask)
    ),
    s = n.length > 0 ? tasks[n[0]].project_id : null;
  console.log(s);
  return s;
}

function extractProjectName(nfTogglTask, projects, tasks) {
  if (nfTogglTask === null) {
    return null;
  }
  let projectID = extractTaskProjectId(nfTogglTask, projects, tasks);
  const n = Object.keys(projects).filter((o) => projects[o].id === projectID),
    s = n.length > 0 ? projects[n[0]].name : null;
  console.log(s);
  return s;
}

////END HELPER
