const { getFile } = require('./keybase');

const BUGSNAG_API_KEY_PATH = '/team/toggl.frontend/toggl-button/bugsnag-api-key';

module.exports = async function getBugsnagKey () {
  if (process.env.BUGSNAG_API_KEY) {
    return process.env.BUGSNAG_API_KEY;
  }
  const { success, payload } = await getFile(BUGSNAG_API_KEY_PATH);
  return success ? payload.trim() : null;
};
