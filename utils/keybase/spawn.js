const spawn = require('cross-spawn-promise');
const { succeed, fail } = require('./response');

exports.keybase = async function keybase () {
  try {
    const payload = (await spawn('keybase', ['status', '-j'], {})).toString();
    return succeed(payload);
  } catch (e) {
    return fail(e.stdout && e.stdout.toString() || e);
  }
};
