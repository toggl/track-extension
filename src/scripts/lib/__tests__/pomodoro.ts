import createPomodoroState from '../pomodoro';

describe('createPomodoroState', () => {
  test('initializes with default values', () => {
    const pomodoro = createPomodoroState();
    expect(pomodoro.state).toBe('idle');
    expect(pomodoro.pomodoroCount).toBe(0);
    expect(pomodoro.breakCount).toBe(0);
  })

  test('logs state transitions to the logger', () => {
    const logger = jest.fn();
    createPomodoroState(null, logger)
      .beginPomodoro();
    expect(logger).toHaveBeenCalledWith('⏱ pomodoro');
  })

  test('can start pomodoro cycles', () => {
    const pomodoro = createPomodoroState()
      .beginPomodoro();
    expect(pomodoro.state).toBe('pomodoro');
    expect(pomodoro.pomodoroCount).toBe(1);
  })

  test('can stop pomodoro cycles', () => {
    // This case is semantics only and does not change state :thinking:
    const pomodoro = createPomodoroState()
      .beginPomodoro()
    expect(pomodoro.state).toBe('pomodoro');
    expect(pomodoro.pomodoroCount).toBe(1);
    expect(pomodoro.breakCount).toBe(0);
  })

  test('can start breaks', () => {
    const pomodoro = createPomodoroState()
      .beginPomodoro()
      .endPomodoro()
      .beginBreak();

    expect(pomodoro.state).toBe('shortbreak');
    expect(pomodoro.pomodoroCount).toBe(1);
    expect(pomodoro.breakCount).toBe(1);
  })

  test('can end breaks', () => {
    const pomodoro = createPomodoroState()
      .beginPomodoro()
      .endPomodoro()
      .beginBreak()
      .endBreak();

    expect(pomodoro.state).toBe('idle');
    expect(pomodoro.pomodoroCount).toBe(1);
    expect(pomodoro.breakCount).toBe(1);
  })

  test('can cancel breaks early', () => {
    // Initial state - we've already had one break before.
    const pomodoro = createPomodoroState()
      .beginPomodoro()
      .endPomodoro()
      .beginBreak()
      .endBreak();

    // Triggering a new break which we'll cancel.
    pomodoro
      .beginPomodoro()
      .endPomodoro()
      .beginBreak()
      .cancelBreak();

    expect(pomodoro.state).toBe('pomodoro');
    expect(pomodoro.pomodoroCount).toBe(2);
    // The break count is decremented
    expect(pomodoro.breakCount).toBe(1);
  })

  test('starts a *long* break when enough pomodoro cycles have been completed', () => {
    // Initial state - had one break before, and will longbreak on every 2nd break
    const pomodoro = createPomodoroState({ longBreakOnNthBreak: 2 })
      .beginPomodoro()
      .endPomodoro()
      .beginBreak()
      .endBreak()
      .beginPomodoro()
      // Begin the next (long) break
      .beginBreak();

    expect(pomodoro.state).toBe('longbreak');
  })

  test('does not start long breaks if they are disabled', () => {
    const pomodoro = createPomodoroState({ longBreakEnabled: false, longBreakOnNthBreak: 2 })
      .beginPomodoro()
      .endPomodoro()
      .beginBreak()
      .endBreak()
      .beginPomodoro()
      // Begin the next (short!) break
      .beginBreak();

    expect(pomodoro.state).toBe('shortbreak');
  })

  test('does not start any breaks if they are disabled', () => {
    // This case exists in case settings are changed on the fly, not entirely sure if it's sensible
    const pomodoro = createPomodoroState({ breaksEnabled: false })
      .beginPomodoro()
      .endPomodoro()
      .beginBreak();

    expect(pomodoro.state).toBe('idle');
  })
})
