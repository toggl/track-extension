const { getFile } = require('./keybase');

const BUGSNAG_API_KEY_PATH = '/team/toggl.frontend/toggl-button/bugsnag-api-key';

module.exports = async function getBugsnagKey () {
  const { success, payload } = await getFile(BUGSNAG_API_KEY_PATH);
  return success ? payload.trim() : null;
};
