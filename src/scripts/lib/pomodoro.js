// TODO: Would need to convert background.js to Typescript.
// type State = 'idle' | 'pomodoro' | 'shortbreak' | 'longbreak';

const defaultOptions = {
  breaksEnabled: true,
  longBreakEnabled: true,
  longBreakOnNthBreak: 4
};

export default function createPomodoroState (partialOptions, log = () => {}) {
  const options = { ...defaultOptions, ...partialOptions };
  log(`⏱ Pomodoro initialized: ${JSON.stringify(options)}`);

  let state = 'idle';
  let pomodoroCount = 0;
  let breakCount = 0;
  function getBreak (count) {
    if (!options.breaksEnabled) return 'idle';
    return options.longBreakEnabled && count % options.longBreakOnNthBreak === 0
      ? 'longbreak' : 'shortbreak';
  };

  return {
    get state () {
      return state;
    },

    get pomodoroCount () {
      return pomodoroCount;
    },

    get breakCount () {
      return breakCount;
    },

    beginPomodoro () {
      if (state !== 'idle') {
        console.error(`⏱ Starting new pomodoro while state is ${state}`);
      }
      state = 'pomodoro';
      pomodoroCount++;
      log('⏱ ' + state);
      return this;
    },

    endPomodoro () {
      if (state !== 'pomodoro') {
        console.error(`⏱ Ending pomodoro while state is ${state}`);
      }
      log('⏱ ' + state);
      return this;
    },

    beginBreak () {
      if (state !== 'pomodoro') {
        console.error(`⏱ Beginning break while state is ${state}`);
      }
      state = getBreak(pomodoroCount);
      breakCount++;
      log('⏱ ' + state);
      return this;
    },

    endBreak () {
      if (state !== 'shortbreak' && state !== 'longbreak') {
        console.error(`⏱ Ending break while state is ${state}`);
      }
      state = 'idle';
      log('⏱ ' + state);
      return this;
    },

    // When the break is begun and notified, but the user wishes to continue tracking for now
    cancelBreak () {
      if (state !== 'shortbreak' && state !== 'longbreak') {
        console.error(`⏱ Cancelling break while state is ${state}`);
      }
      state = 'pomodoro';
      breakCount--;
      log('⏱ ' + state);
      return this;
    }
  };
}
