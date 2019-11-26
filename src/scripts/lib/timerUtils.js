import map from 'lodash.map';
import reduce from 'lodash.reduce';
import moment from 'moment';
import { secToHhmmImproved } from '../@toggl/time-format-utils/index';

const _ = {
  map,
  reduce
};

const MAX_DURATION = 3596400000; // 999 hours in milliseconds
const HHMMSS_DURATION_REGEX = /^\s*(\d+)?[ :;_/-]?([\d,.]+)?:?([[ :;_/-]+[\d,.]+)?\s*$/;
const HUMAN_DURATION_REGEX = /^\s*((\d+(?:\.|,)?\d*|\d*(?:\.|,)?\d+)\s*(((m|min|mins|minute|minutes)?)|((h|hr|hrs|hour|hours)?)|((s|sec|secs|second|seconds)?)|((d|ds|day|days)?)|((w|wk|wks|week|weeks)?))?\s*)+$/i;

/**
 * Returns stop date of given time entry, handling duronly entries.
 * @param  {object} timeEntry Time entry
 * @return {string}
 */
export function getStopDate (timeEntry) {
  return (
    timeEntry.stop ||
    moment(timeEntry.start)
      .add(getDuration(timeEntry), 'seconds')
      .format()
  );
}

export function getStartDateSeconds (timeEntry) {
  return moment(timeEntry.start).unix();
}
/**
 * Returns stop date of given time entry as a unix timestamp (seconds)
 * @param  {object} timeEntry Time entry
 * @return {number}
 */
export function getStopDateSeconds (timeEntry) {
  return moment(getStopDate(timeEntry)).unix();
}

/**
 * Returns the duration of a time entry. Also handles duronly and/or running entries.
 * @param  {object} timeEntry Time entry
 * @return {number} duration in seconds
 */
export function getDuration (timeEntry) {
  if (timeEntry.duration >= 0) {
    return timeEntry.duration;
  }
  if (timeEntry.duronly) {
    return moment().unix() + timeEntry.duration;
  }
  return moment().diff(timeEntry.start, 'seconds');
}

/**
 * Calculates duration from start and stop dates. Will work for running time entries (without stop date),
 * that should have a negative duration.
 * @param {Date} start time
 * @param {Date} stop time (optional)
 * @return {number} duration in seconds
 */
export function calculateDuration (start, stop) {
  const startValue = start.valueOf();
  const stopValue = stop ? stop.valueOf() : 0;
  return Math.round((stopValue - startValue) / 1000);
}

/**
 * Calculates stop date from start date and duration. Will return null if duration is negative, because
 * that indicates a running time entry (without a stop date).
 * @param {Date} start time
 * @param {number} duration in seconds
 * @return {Date} stop date
 */
export function calculateStopDate (start, duration) {
  if (duration < 0) return null;

  const startValue = start.valueOf();
  const stopValue = startValue + duration * 1000;
  return moment(stopValue).toDate();
}

/**
 * Returns the earliest start date witin the given TEs
 * @param  {Object|Array} timeEntries Time entries
 * @return {string}
 */
export function getGroupStartDate (timeEntries) {
  const firstTE = _(timeEntries.slice())
    .sortBy(getStartDateSeconds)
    .head();
  return firstTE.start;
}

/**
 * Returns the latest stop date witin the given TEs
 * @param  {Object|Array} timeEntries Time entries
 * @return {string}
 */
export function getGroupStopDate (timeEntries) {
  const firstTE = _(timeEntries.slice())
    .sortBy(getStopDateSeconds)
    .last();
  return getStopDate(firstTE);
}

/**
 * Returns total duration in seconds of given TEs
 * @param  {Object|Array} timeEntries Time entries to sum
 * @return {number}             Total duration in seconds
 */
export function getGroupDuration (timeEntries) {
  return _.reduce(
    timeEntries,
    (sum, te) => {
      if (!te.duration) return sum;

      const duration = getDuration(te);
      sum += duration;
      return sum;
    },
    0
  );
}

/**
 * Returns whether given duration is a valid duration for the Timer components
 * @param  {string}  duration Duration
 * @return {Boolean}
 */
export function isValidDuration (duration) {
  return isValidTimeDuration(duration) || isValidHumanDuration(duration);
}

/**
 * Returns whether given duration is a valid time duration (variants of hh:mm:ss)
 * @param  {string}  duration Duration
 * @return {Boolean}
 */
export function isValidTimeDuration (duration) {
  return HHMMSS_DURATION_REGEX.test(duration);
}

/**
 * Returns whether given duration is a valid human duration (variants of 1h30m, 15m30secs, etc)
 * @param  {string}  duration Duration
 * @return {Boolean}
 */
export function isValidHumanDuration (duration) {
  return HUMAN_DURATION_REGEX.test(duration);
}

/**
 * Returns duration limited by the Max duration value
 * @param  {object} Duration
 * @return {object} Duration
 */
export function forceMaxDuration (duration) {
  return duration.asMilliseconds() > MAX_DURATION
    ? moment.duration(MAX_DURATION)
    : duration;
}

/**
 * Returns moment duration object
 * Accepts either 'human' durations (e.g. 1h30minutes) or standard formats (e.g. 10:30:00).
 * @param  {string} str Duration string to parse
 * @return {object} Duration in milliseconds
 */
export function parseDuration (str) {
  const duration = isValidHumanDuration(str)
    ? parseHumanDuration(str)
    : parseTimeDuration(str);
  return forceMaxDuration(duration);
}

/**
 * Returns duration in seconds of given string
 * Accepts strings like:
 * - 2 (2 min)
 * - 2.5 (2.5 min)
 * - 2:5 (2 min, 5 sec)
 * - 2:5:5 (2h, 5min, 5 sec)
 * - 2;5;5 (2h, 5min, 5 sec)
 * - 2::5 (2h, 0min, 5 sec)
 * - 2.5:5:5 (2h, 35min, 5 sec)
 * - 2,5,5 (2h, 30min, 30 sec)
 * - 2:65:5 (3h, 5min, 5 sec)
 * @param  {string}  str Duration
 * @return {Duration} the momentjs duration object, always positive
 */
export function parseTimeDuration (str) {
  str = str.replace(/[,.]+/g, '.').replace(/[ :;_/-]+/g, ':'); // 2,5;5 => 2.5:5
  let hms = _.map(str.split(':'), part => parseFloat(part || 0));

  if (hms.length === 1) {
    if (hms[0] > 99) hms = [Math.floor(hms[0] / 100), hms[0] % 100, void 0];
    else hms = [void 0, hms[0], void 0];
  }

  if (hms.length >= 2) hms = [hms[0], hms[1], hms[2] || void 0];

  return moment.duration({
    seconds: (hms[0] || 0) * 60 * 60 + (hms[1] || 0) * 60 + (hms[2] || 0)
  });
}

/**
 * Returns moment duration object of the given duration. Returns null if invalid duration format.
 * Formats:
 * - `43:22`, `8:15`, `7:2`, `:35`, `62:` -> hh:mm
 * - `3,5`, `74.56`, `,37`, `62.` -> hours
 * - `2`, `62`, 235` -> minutes
 * - `23 unit`, `57.3 unit` -> unit
 *
 * @param {string} inputDuration Input to parse
 * @param {Object} [options]
 * @param {string} [options.defaultUnit] The unit to default to, pluralized
 * @return {moment|null}
 */
export function parseHumanDuration (inputDuration, options = {}) {
  let input = inputDuration;
  let match = HHMMSS_DURATION_REGEX.exec(input);
  if (match) {
    return parseTimeDuration(input);
  }

  let accumulated = null;
  let value;
  let valueDuration;
  input = input.replace(/[,.]+/g, '.');
  match = HUMAN_DURATION_REGEX.exec(input);

  // Go through regex matches and accumulate a duration
  while (match) {
    value = +match[2];

    // Parse the value according to the group
    // If there was no group defined then parse the values as minutes
    // If `,` or `.` is used then parse as hours
    const hasUnitMinutes = match[5] != null;
    const hasUnitHours = match[7] != null;
    const hasUnitSeconds = match[9] != null;
    const hasUnitDays = match[11] != null;
    const hasUnitWeeks = match[13] != null;
    const isDecimalNoUnit = /^\d*\.\d*$/.exec(match[1]);

    if (hasUnitHours) {
      valueDuration = { hours: value };
    } else if (hasUnitSeconds) {
      valueDuration = { seconds: value };
    } else if (hasUnitMinutes) {
      valueDuration = { minutes: value };
    } else if (hasUnitDays) {
      valueDuration = { days: value };
    } else if (hasUnitWeeks) {
      valueDuration = { weeks: value };
    } else if (options.defaultUnit) {
      valueDuration = {
        [options.defaultUnit]: value
      };
    } else if (isDecimalNoUnit && !options.defaultDecimal) {
      valueDuration = { hours: value };
    } else {
      valueDuration = { minutes: value };
    }

    if (!accumulated) accumulated = moment.duration(0);
    accumulated = accumulated.add(valueDuration);

    // We could just re-run `exec` on the string and it should work, but we'd
    // have to take the beginning of the line constraint and mess up validation.
    input = input.replace(match[1], '');
    match = HUMAN_DURATION_REGEX.exec(input);
    if (match && input) {
      if (isDecimalNoUnit) return null;
    } else {
      return accumulated;
    }
  }

  return accumulated;
}

export function formatDuration (duration, options) {
  return secToHhmmImproved(duration, options);
}

/**
 * Returns whether given time string is valid
 * @see https://momentjs.com/guides/#/parsing/
 * @param  {string}  time the input string
 * @return {Boolean}
 */
export function isValidTime (time) {
  return [
    'H',
    'HA',
    'H A',
    'H,mm',
    'Hmm',
    'HmmA',
    'Hmm A',
    'H,mmA',
    'H,mm A',
    'H.mm',
    'H.mmA',
    'H.mm A',
    'H:mm',
    'H:mmA',
    'H:mm A',
    'H;mm',
    'H;mmA',
    'H;mm A',
    'HH',
    'HHA',
    'HH A',
    'HHmm',
    'HHmmA',
    'HHmm A',
    'HH,mm',
    'HH,mmA',
    'HH,mm A',
    'HH.mm',
    'HH.mmA',
    'HH.mm A',
    'HH:mm',
    'HH:mmA',
    'HH:mm A',
    'HH;mm',
    'HH;mmA',
    'HH;mm A'
  ].some(format => moment(time, format, true).isValid());
}

/**
 * Parse time input into valid Date objects.
 * Returns an object representing the parsed time in 24h format.
 * @param  {string} str          input string
 * @param  {Boolean} use24hClock indicates whether prevDate should be used to determine
 *                               if the time should be am or pm if it appears to be earlier than 12pm
 *                               and there is no info about whether it is actually am or pm
 * @param  {Date} prevDate    if no am/pm specified in string, compare both to this date and use whatever is closest.
 * @return {object}              {hours: ..., minutes: ...}
 */
export function parseTime (str, use24hClock, prevDate = null) {
  str = str
    .toLowerCase()
    .replace(/[,.:;]+/, ':')
    .trim();

  /**
   * Parse hours and minutes from the time string and return the hours minute components
   * as elements of len-2 array.
   * @param  {string} str The input string such as '100', '1:00', '1200', '12:00'
   * @return {array}      [hh, mm]
   */
  function getHoursMinutes (str) {
    if (str.indexOf(':') > -1) {
      return _.map(str.split(':'), part => parseInt(part, 10) || 0);
    } else {
      str = str.replace(/[^0-9]/g, '');
      if (str.length <= 2) {
        return [parseInt(str, 10), 0]; // h and hh
      } else if (str.length <= 3) {
        return [parseInt(str[0], 10), parseInt(str.substr(1), 10)]; // hmm
      } else {
        return [parseInt(str.substr(0, 2), 10), parseInt(str.substr(2), 10)]; // hhmm and hhmmmmmm..
      }
    }
  }

  /**
   * Take an input array of [hh, mm] and add hours to `hh` as necessary if `mm` exceeds 59
   * @param  {array} hm [hh, mm]
   * @return {array}    [hh, mm]
   */
  function overflowMinutes (hm) {
    hm = hm.slice();
    hm[0] += Math.floor(hm[1] / 60);
    hm[1] = hm[1] % 60;
    return hm;
  }

  let hm = getHoursMinutes(str);
  hm[0] = hm[0] % 24; // Lose extra days
  hm = overflowMinutes(hm);

  // If we're in 24h mode or the user inputs more than 12 hours, there's no need to add any more magic
  if (use24hClock || hm[0] >= 13) {
    return { hours: hm[0], minutes: hm[1] };
  }

  const isPM = _isPm(str, hm, use24hClock, prevDate);

  if (hm[0] === 12) hm[0] = 0; // twelvehouranians say 12:00 when they mean 0:00. We need to normalize that

  if (isPM === true) {
    hm[0] += 12;
  }

  return { hours: hm[0], minutes: hm[1] };
}

/**
 * Return true if the time should be PM. The time is PM if the string contains 'p' or 'pm' explicitly or, if no
 * am/pm found in string, it should be PM if that time is closer to the time in prevDate
 *
 * @param  {string} str The time string like '11:22a', assumed to be in 12h format
 * @return {boolean}    true if PM
 */
export function _isPm (str, hm, use24hClock, prevDate) {
  let isPM = null; // null represents "we don't know"
  const ampmMatch = str.toLowerCase().match(/(a|p)m?$/);

  if (ampmMatch) {
    str = str.substr(0, str.length - ampmMatch[0].length);
    isPM = ampmMatch[0] === 'p' || ampmMatch[0] === 'pm';
  } else if (!use24hClock && prevDate) {
    // No am/pm found in string but we need *something* => take the closest value to prevDate
    if (hm[0] === 12) hm = [0, hm[1]]; // twelvehouranians say 12:00 when they mean 0:00. We need to normalize that
    const date = moment().set({ hours: hm[0], minutes: hm[1] });
    const prevTimeInPrevDay = moment()
      .subtract(1, 'day')
      .set({ hours: prevDate.getHours(), minutes: prevDate.getMinutes() });
    const prevTimeInCurrentDay = moment().set({
      hours: prevDate.getHours(),
      minutes: prevDate.getMinutes()
    });
    const prevTimeInNextDay = moment()
      .add(1, 'day')
      .set({ hours: prevDate.getHours(), minutes: prevDate.getMinutes() });
    const diffPrevDay = Math.abs(date.valueOf() - prevTimeInPrevDay.valueOf());
    const diffCurrentDayAM = Math.abs(
      date.valueOf() - prevTimeInCurrentDay.valueOf()
    );
    const diffCurrentDayPM = Math.abs(
      date.valueOf() + 12 * 60 * 60 * 1000 - prevTimeInCurrentDay.valueOf()
    );
    const diffNextDay = Math.abs(
      date.valueOf() + 12 * 60 * 60 * 1000 - prevTimeInNextDay.valueOf()
    );
    const smallest = Math.min(
      diffPrevDay,
      diffCurrentDayAM,
      diffCurrentDayPM,
      diffNextDay
    );

    if (smallest === diffPrevDay) isPM = false;
    else if (smallest === diffCurrentDayAM) isPM = false;
    else if (smallest === diffCurrentDayPM) isPM = true;
    else if (smallest === diffNextDay) isPM = true;
  }

  return isPM;
}
