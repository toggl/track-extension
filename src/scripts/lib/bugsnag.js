import bugsnag from 'bugsnag-js';

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
    beforeSend: function (report) {
      if (localStorage.getItem('sendErrorReports') !== 'true') {
        report.ignore();
      }
    }
  });

  bugsnagClient.beforeNotify = function (error) {
    error.stacktrace = error.stacktrace.replace(
      /chrome-extension:/g,
      'chromeextension:'
    );
  };

  return bugsnagClient;
}

const client = getBugsnagClient();
export default client;
