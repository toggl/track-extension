const succeed = payload => ({ success: true, payload });
const fail = payload => ({ success: false, payload });

module.exports = {
  succeed,
  fail
};
