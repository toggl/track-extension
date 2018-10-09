import bugsnag from 'bugsnag-js';

const client = bugsnag({
  apiKey: process.env.BUGSNAG_API_KEY,
  appVersion: process.env.APP_VERSION,
  releaseStage: process.env.NODE_ENV,
  notifyReleaseStages: ['production', 'development'],
  autoBreadcrumbs: false,
  autoCaptureSessions: false,
  collectUserIp: false
});

client.beforeNotify = function(error, metaData) {
  error.stacktrace = error.stacktrace.replace(
    /chrome-extension:/g,
    'chromeextension:'
  );
};

export default client;
