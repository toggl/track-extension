import bugsnag from '@bugsnag/js';
const browser = require('webextension-polyfill');

function noop (fnName) {
  return function () {
    console.warn(`In bugsnag.${fnName} BUGSNAG_API_KEY is undefined`);
  };
};

function getBugsnagClient () {
  if (!process.env.BUGSNAG_API_KEY) {
    return {
      leaveBreadcrumb: noop('leaveBreadcrumb'),
      notify: noop('notify')
    };
  }

  const bugsnagClient = bugsnag({
    apiKey: process.env.BUGSNAG_API_KEY,
    appVersion: process.env.VERSION,
    releaseStage: process.env.NODE_ENV,
    notifyReleaseStages: ['production', 'development'],
    autoBreadcrumbs: false,
    autoCaptureSessions: false,
    collectUserIp: false,
    beforeSend: async function (report) {
      const db = browser.extension.getBackgroundPage().db;
      const sendErrorReports = await db.get('sendErrorReports');
      if (!sendErrorReports) {
        report.ignore();
        return false;
      }

      report.stacktrace = report.stacktrace.map(function (frame) {
        frame.file = frame.file.replace(/chrome-extension:/g, 'chrome_extension:');
        // Create consistent file paths for source mapping / error reporting.
        frame.file = frame.file.replace(
          /.*(moz-extension|chrome_extension|chrome-extension|file):\/\/.*\/scripts\/(.*)/ig,
          'togglbutton://scripts/$2'
        );
        return frame;
      });
    }
  });

  return bugsnagClient;
}

const client = getBugsnagClient();
export default client;
