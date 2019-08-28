/*
 * Formats an amount of seconds in the specified "duration format"
 *
 * @param {Number} t Amount in seconds
 * @param {String} type One of 'improved', 'decimal' and 'classic'
 * @return {String}
 *
*/
module.exports.secondsToExtHhmmss = (t, type, options = { html: true }) => {
  if (type === 'improved') {
    return module.exports.secToHhmmImproved(t, options)
  } else if (type === 'decimal') {
    return module.exports.secToDecimalHours(t)
  } else {
    return module.exports.millisecondsToHhmmss(t * 1000)
  }
}

/*
 * Pretty formats some amount of milliseconds in a span `duration` tag.
 *
 * @param {Number} seconds
 * @return {String}
*/
module.exports.secToHhmmImproved = (seconds, options = { html: true }) => {
  if (!seconds && seconds !== 0) {
    return ''
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  seconds = Math.floor(seconds % 60)

  const sminutes = leftPad(minutes, 2, '0')
  const sseconds = leftPad(seconds % 60, 2, '0')

  if (!options.html) {
    return `${hours}:${sminutes}:${sseconds}`
  }

  let formatted = ''

  if (hours > 0) {
    formatted = `<strong>${hours}</strong>:${sminutes}:${sseconds}`
  } else if (minutes > 0) {
    formatted = `${hours}:<strong>${sminutes}</strong>:${sseconds}`
  } else {
    formatted = `${hours}:${sminutes}:${sseconds}`
  }

  return `<span class='time-format-utils__duration'>${formatted}</span>`
}

/*
 * Pretty formats some amount of milliseconds in "hh:mm:ss".
 *
 * @param {Number} ms
 * @return {String}
*/
module.exports.millisecondsToHhmmss = (ms, withoutSeconds) => {
  if (typeof ms !== 'number') {
    ms = parseInt(ms, 10)
  }

  if (isNaN(ms)) {
    return '0 sec'
  }

  let hours = Math.floor(ms / 3600000)
  let minutes = Math.floor((ms % 3600000) / 60000)
  let seconds = Math.floor((ms % 60000) / 1000)

  if (withoutSeconds) {
    return hours
      ? hours + 'h ' + leftPad(minutes, 2, '0') + ' min'
      : minutes + ' min'
  }

  if (!hours) {
    if (!minutes) {
      return seconds + ' sec'
    }

    seconds = leftPad(seconds, 2, '0')
    minutes = leftPad(minutes, 2, '0')
    return minutes + ':' + seconds + ' min'
  }

  minutes = leftPad(minutes, 2, '0')
  seconds = leftPad(seconds, 2, '0')
  hours = leftPad(hours, 2, '0')

  return hours + ':' + minutes + ':' + seconds
}

/*
 * Formats some amount of seconds in hours with two decimal cases ("hh.hh h").
 *
 * @param {Number} secs
 * @return {String}
*/
module.exports.secToDecimalHours = secs => (secs / 60 / 60).toFixed(2) + ' h'

/*
 * Formats some amount of seconds in "hh:mm" with a variable separator `sep` and
 * suffix `suffix`.
 *
 * @param {Number} secs The amount of seconds to format
 * @param {String} sep A separator
 * @param {String} suffix A suffix
 * @return {String}
*/
const baseSecondsToHhmm = (module.exports._baseSecondsToHhmm = (
  secs,
  sep = ':',
  suffix = ''
) => {
  const hours = '' + Math.floor(secs / 3600)
  const minutes = leftPad('' + Math.floor((secs % 3600) / 60), 2, '0')
  return hours + sep + minutes + suffix
})

/*
 * Pads a value `val` to the left by `size` `ch` or `' '` characters.
 *
 * @param {Mixed} val The value to pad
 * @param {Number} size The padding's size
 * @param {String} [ch=' '] The padding character
 * @return {String} The padding result
*/
const leftPad = (module.exports._leftPad = (val, size, ch = ' ') => {
  let result = '' + val
  while (result.length < size) {
    result = ch + result
  }

  return result
})

// Formatting helper functions:
module.exports.secondsToHhmm = secs => baseSecondsToHhmm(secs, ':', ' h')
module.exports.secondsToSmallHhmm = secs => baseSecondsToHhmm(secs, ':')
module.exports.secondsToPrettyHhmm = secs =>
  baseSecondsToHhmm(secs, ' h ', ' min')
