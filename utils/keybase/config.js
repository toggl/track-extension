const { get, join } = require('lodash/fp');
const { succeed, fail } = require('./response');
const { keybase } = require('./spawn');

function parseConfig ({ payload: content }) {
  try {
    return succeed(JSON.parse(content));
  } catch (e) {
    return fail(e);
  }
}

const parsePath = value => (Array.isArray(value) ? join('.', value) : value);

/**
 * Gets keybase config from local store
 * @param {string[]|string} array or dot separated path
 * @returns {Object} keybase config value
 */
exports.getKeybaseConfig = async function getKeybaseConfig (configPath) {
  const res = await keybase();
  if (!res.success) {
    return res;
  }

  const config = parseConfig(res);
  if (!config.success) {
    return config;
  }

  const parsedPath = parsePath(configPath);

  return succeed(get(parsedPath, config.payload));
};
