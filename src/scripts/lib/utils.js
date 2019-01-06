import bugsnagClient from './bugsnag';

export function secToHHMM(sum) {
  var hours = Math.floor(sum / 3600),
    minutes = Math.floor((sum % 3600) / 60);

  return hours + 'h ' + minutes + 'm';
}

export function report(e) {
  if (process.env.DEBUG) {
    console.error(e);
  } else {
    bugsnagClient.notify(e);
  }
}

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

export function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function(s) {
    return entityMap[s];
  });
}
