import Bugsnag from '@bugsnag/js';
import { Error } from '@bugsnag/core/types/event';
import * as browser from 'webextension-polyfill';

function noop(fnName: string) {
  return function () {
    console.warn(`In bugsnag.${fnName} BUGSNAG_API_KEY is undefined`);
  };
}

function processError(err: Error) {
  err.stacktrace = err.stacktrace.map(function (frame) {
    frame.file = frame.file.replace(/chrome-extension:/g, 'chrome_extension:');
    // Create consistent file paths for source mapping / error reporting.
    frame.file = frame.file.replace(
      /.*(moz-extension|chrome_extension|chrome-extension|file):\/\/.*\/scripts\/(.*)/gi,
      'togglbutton://scripts/$2'
    );
    // Normalize path separators across OSs
    frame.file = frame.file.replace(/\\/g, '/');
    return frame;
  });
  return err;
}

function getBugsnagClient() {
  if (!process.env.BUGSNAG_API_KEY) {
    return {
      leaveBreadcrumb: noop('leaveBreadcrumb'),
      notify: noop('notify')
    };
  }

  const bugsnagClient = Bugsnag.start({
    apiKey: process.env.BUGSNAG_API_KEY,
    appVersion: process.env.VERSION,
    releaseStage: process.env.NODE_ENV,
    enabledReleaseStages: ['production', 'development'],
    enabledBreadcrumbTypes: [],
    autoTrackSessions: false,
    collectUserIp: false,
    onError: async function (errEvt) {
      const db = browser.extension.getBackgroundPage().db;
      const sendErrorReports = await db.get('sendErrorReports');
      if (!sendErrorReports) {
        return false;
      }

      errEvt.errors.map(processError);
    },
  });

  return bugsnagClient;
}

const client = getBugsnagClient();
export default client;
