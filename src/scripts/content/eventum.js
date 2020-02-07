'use strict';

// jsonata jsonataExpression for tags, must return an array of tags
// @see http://docs.jsonata.org/overview.html
const jsonataExpression = `
  {
    "projectName" : project.name,
    "tags": custom_fields
  }
`;

togglbutton.render('.issue_view:not(.toggl)', {}, function (elem) {
  const issueId = $('#issue_overview', elem).getAttribute('data-issue-id');
  const description = $('#issue_overview #issue_summary', elem).textContent;

  // find the project dropdown
  // if the dropdown exists, its multiproject
  // otherwise take it from text value
  const projectSelect = $(
    '#project_chooser > form > select[name=current_project]',
    elem
  );
  const project = projectSelect
    ? projectSelect.options[projectSelect.selectedIndex].text
    : $('#project_chooser').textContent.replace(/^\s+Project:\s/, '');

  const link = togglbutton.createTimerLink({
    className: 'eventum',
    description: '#' + issueId + ' ' + description,
    ...buildParameters(jsonataExpression, project)
  });

  const container = $('div#issue_menu', elem);
  const spanTag = document.createElement('span');
  container.parentNode.appendChild(spanTag.appendChild(link));
});

function buildParameters (expression, projectName) {
  const json = {
    project: {
      name: projectName
    },
    custom_fields: getCustomFields()
  };

  let parameters = [];
  try {
    console.log('jsonata', json, expression);
    parameters = window.jsonata(expression).evaluate(json);
    console.log('jsonata result', parameters);
  } catch (e) {
    console.error('jsonata error', e);
  }

  return parameters;
}

/**
 * Abstract method to extract custom fields as field name => field value.
 *
 * @returns {{}}
 */
function getCustomFields () {
  const fields = {};
  const $rows = document.querySelectorAll('div.issue_section#custom_fields>div.content>table>tbody>tr');

  if (!$rows) {
    return fields;
  }

  for (const $row of Object.values($rows)) {
    const $cells = $row.children;
    const fieldName = $cells[0].textContent.trim();
    const fieldValue = $cells[1].textContent.trim();

    // Empty values have no purpose
    if (!fieldValue) {
      continue;
    }
    fields[fieldName] = fieldValue;
  }

  return fields;
}
