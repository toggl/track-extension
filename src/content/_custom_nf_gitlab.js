//// START GITLAB
togglbutton.render(
  '.issue-details .detail-page-description:not(.toggl)',
  { observe: !0 },
  function (t) {
    const n = [
      [a()]
        .filter(Boolean)
        .map(function (r) {
          return '#' + r;
        })
        .join(''),
      i(t),
    ]
      .filter(Boolean)
      .join(' ');
    o($('.detail-page-header-actions'), n, !0), o($('.time-tracker'), n);
  }
);
togglbutton.render(
  '.merge-request > .detail-page-header:not(.toggl)',
  { observe: !0 },
  function (t) {
    const n = [
      [a()]
        .filter(Boolean)
        .map(function (r) {
          return 'MR' + r + '::';
        })
        .join(''),
      i(t),
    ]
      .filter(Boolean)
      .join(' ');
    o($('.detail-page-header-actions'), n, !0), o($('.time-tracker'), n);
  }
);
function o(t, e, n = !1) {
  const r = togglbutton.createTimerLink({
    className: 'gitlab',
    description: e,
    tags: l,
    taskId: (o, i) => {
      return extractTaskId(o, i);
    },
    projectName: (o, i) => {
      return extractProjectName(o, i);
    },
  });
  n ? t.parentElement.insertBefore(r, t) : t.parentElement.appendChild(r, t);
}
function i(t) {
  const e = t.querySelector('.title');
  return e ? e.textContent.trim() : '';
}
function a() {
  const t = window.location.pathname,
    e = /-\/(issues|merge_requests)\/(?<id>\d+)/;
  return (e.test(t) ? t.match(e) : { groups: { id: '' } }).groups.id;
}
function s() {
  const t =
    $('.title .project-item-select-holder') ||
    $('.breadcrumbs-list li:nth-last-child(3) .breadcrumb-item-text');
  return t ? t.textContent.trim() : '';
}
function l() {
  const t = document.querySelectorAll('div.labels span[data-qa-label-name]');
  if (!t) return [];
  const e = [];
  for (const n of Object.values(t)) {
    const r = n.getAttribute('data-qa-label-name');
    e.push(r);
  }
  return e;
}

////END GITLAB

////START HELPER
const ExtractNFGitlabTogglTaskId = () => {
  debugger;
  let togglTaskId = null;
  let tags = l();
  const GITLAB_LABEL_REGEX = /togg(e|)l(::|:)/gim;
  const REMOVE_TRALING_LABEL_DESCRIPTION = / .*/;

  debugger;
  if (Array.isArray(tags)) {
    tags.forEach((element) => {
      if (element.match(GITLAB_LABEL_REGEX)) {
        togglTaskId = element
          .replace(GITLAB_LABEL_REGEX, '')
          .toUpperCase()
          .replace(REMOVE_TRALING_LABEL_DESCRIPTION, '');
        return;
      }
    });
  }
  return togglTaskId;
};

function extractTaskId(projects, tasks) {
  debugger;
  let nfTogglTask = ExtractNFGitlabTogglTaskId();
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

function extractProjectName(projects, tasks) {
  debugger;
  let nfTogglTask = ExtractNFGitlabTogglTaskId();
  if (nfTogglTask === null) {
    return null;
  }

  let projectID = extractTaskProjectId(nfTogglTask, projects, tasks);
  const n = Object.keys(projects).filter((o) => projects[o].id === projectID),
    s = n.length > 0 ? projects[n[0]].name : null;
  console.log(s);
  return s;
}
