import React, { PureComponent, type ReactNode } from 'react';
import { EventEmitter } from 'events';
import { Box, Text } from 'ink';
import {
  TerminalDimensionsContext,
  InkContext,
  ExitContext,
  StdinContext,
  FocusContext,
  TerminalFocusContext,
  ThemeContext,
} from '../contexts.js';

// ANSI escape sequences
const FOCUS_REPORTING_ENABLE = '\x1b[?1004h';
const FOCUS_REPORTING_DISABLE = '\x1b[?1004l';
const ALTERNATIVE_SCREEN_ENABLE = '\x1b[?1049h';
const ALTERNATIVE_SCREEN_DISABLE = '\x1b[?1049l';
const BRACKETED_PASTE_ENABLE = '\x1b[?2004h';
const BRACKETED_PASTE_DISABLE = '\x1b[?2004l';

const FOCUS_SUPPORTED_TERMINALS = ['iTerm.app', 'kitty', 'WezTerm', 'ghostty'];

interface Focusable {
  id: string;
  isActive: boolean;
}

interface InternalAppState {
  isFocusEnabled: boolean;
  activeFocusId: string | undefined;
  focusables: Focusable[];
  error: Error | undefined;
  isTerminalFocused: boolean;
}

interface InternalAppProps {
  terminalColumns: number;
  terminalRows: number;
  ink2: boolean;
  stdin: NodeJS.ReadStream;
  stdout: NodeJS.WriteStream;
  exitOnCtrlC: boolean;
  initialTheme: any;
  onThemeChange?: (theme: any) => void;
  onThemeSave?: (theme: any) => void;
  onExit: (error?: Error) => void;
  children?: ReactNode;
}

/**
 * InternalApp - Root application component with provider chain
 * Original: w21 in chunks.67.mjs
 */
export class InternalApp extends PureComponent<InternalAppProps, InternalAppState> {
  static displayName = 'InternalApp';

  state: InternalAppState = {
    isFocusEnabled: true,
    activeFocusId: undefined,
    focusables: [],
    error: undefined,
    isTerminalFocused: true,
  };

  private rawModeEnabledCount = 0;
  private internal_eventEmitter = new EventEmitter();
  private incompleteEscapeTimer: NodeJS.Timeout | null = null;
  private NORMAL_TIMEOUT = 50;
  private PASTE_TIMEOUT = 500;

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidMount() {
    // Hide cursor and enable focus reporting if TTY
    if (this.props.stdout.isTTY) {
      this.props.stdout.write('\x1b[?25l'); // cursorHide
      
      const accessibilityMode = process.env.CLAUDE_CODE_ACCESSIBILITY === '1' || process.env.CLAUDE_CODE_ACCESSIBILITY === 'true';
      if (!accessibilityMode) {
        this.props.stdout.write(FOCUS_REPORTING_ENABLE);
      }
    }
    process.on('SIGCONT', this.handleResume);
  }

  componentWillUnmount() {
    if (this.props.stdout.isTTY) {
      this.props.stdout.write('\x1b[?25h'); // cursorShow
      this.props.stdout.write(FOCUS_REPORTING_DISABLE);
    }
    process.off('SIGCONT', this.handleResume);
    if (this.incompleteEscapeTimer) {
      clearTimeout(this.incompleteEscapeTimer);
      this.incompleteEscapeTimer = null;
    }
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false);
    }
  }

  handleResume = () => {
    if (this.props.stdout.isTTY) {
      this.props.stdout.write('\x1b[?25l'); // cursorHide
      const terminal = process.env.TERM_PROGRAM || '';
      if (FOCUS_SUPPORTED_TERMINALS.includes(terminal)) {
        this.props.stdout.write(FOCUS_REPORTING_ENABLE);
      }
    }
    this.internal_eventEmitter.emit('resume');
  };

  componentDidCatch(error: Error) {
    this.handleExit(error);
  }

  isRawModeSupported() {
    return this.props.stdin.isTTY;
  }

  handleSetRawMode = (enabled: boolean) => {
    const { stdin, stdout } = this.props;
    if (!this.isRawModeSupported()) {
      throw Error('Raw mode is not supported on the current stdin.');
    }

    stdin.setEncoding('utf8');

    if (enabled) {
      if (this.rawModeEnabledCount === 0) {
        stdin.ref();
        stdin.setRawMode(true);
        stdin.addListener('readable', this.handleReadable);
        stdout.write(BRACKETED_PASTE_ENABLE);
        stdout.write(ALTERNATIVE_SCREEN_ENABLE);
        
        const terminal = process.env.TERM_PROGRAM || '';
        if (FOCUS_SUPPORTED_TERMINALS.includes(terminal)) {
          stdout.write(FOCUS_REPORTING_ENABLE);
        }
      }
      this.rawModeEnabledCount++;
      return;
    }

    if (--this.rawModeEnabledCount === 0) {
      const terminal = process.env.TERM_PROGRAM || '';
      if (FOCUS_SUPPORTED_TERMINALS.includes(terminal)) {
        stdout.write(FOCUS_REPORTING_DISABLE);
      }
      stdout.write(BRACKETED_PASTE_DISABLE);
      stdout.write(ALTERNATIVE_SCREEN_DISABLE);
      stdin.setRawMode(false);
      stdin.removeListener('readable', this.handleReadable);
      stdin.unref();
    }
  };

  handleReadable = () => {
    let chunk;
    while ((chunk = this.props.stdin.read()) !== null) {
      this.processInput(chunk);
    }
  };

  processInput = (data: string | null) => {
    if (data === null) return;

    // Detect terminal focus sequences
    if (data.includes('\x1b[I')) this.handleTerminalFocus(true);
    if (data.includes('\x1b[O')) this.handleTerminalFocus(false);

    // Emit raw input for components to consume
    this.internal_eventEmitter.emit('input', data);

    // Handle Ctrl+C
    if (data === '\x03' && this.props.exitOnCtrlC) {
      this.handleExit();
    }

    // Handle Ctrl+Z (Suspend) on non-Windows
    if (data === '\x1a' && process.platform !== 'win32') {
      this.handleSuspend();
    }

    // Handle Escape to clear focus
    if (data === '\x1b' && this.state.activeFocusId) {
      this.setState({ activeFocusId: undefined });
    }

    // Handle focus navigation
    if (this.state.isFocusEnabled && this.state.focusables.length > 0) {
      if (data === '\t') this.focusNext();
      if (data === '\x1b[Z') this.focusPrevious();
    }
  };

  handleSuspend = () => {
    if (!this.isRawModeSupported()) return;
    
    // Save raw mode count and disable it completely
    const previousCount = this.rawModeEnabledCount;
    while (this.rawModeEnabledCount > 0) {
      this.handleSetRawMode(false);
    }

    if (this.props.stdout.isTTY) {
      this.props.stdout.write('\x1b[?25h'); // cursorShow
      this.props.stdout.write(FOCUS_REPORTING_DISABLE);
    }

    this.internal_eventEmitter.emit('suspend');

    const onContinue = () => {
      // Restore raw mode
      for (let i = 0; i < previousCount; i++) {
        if (this.isRawModeSupported()) {
          this.handleSetRawMode(true);
        }
      }
      
      if (this.props.stdout.isTTY) {
        this.props.stdout.write('\x1b[?25l'); // cursorHide
        this.props.stdout.write(FOCUS_REPORTING_ENABLE);
      }
      
      this.internal_eventEmitter.emit('resume');
      process.removeListener('SIGCONT', onContinue);
    };

    process.on('SIGCONT', onContinue);
    process.kill(process.pid, 'SIGSTOP');
  };

  handleTerminalFocus = (isFocused: boolean) => {
    this.setState((prevState) => {
      if (prevState.isTerminalFocused === isFocused) return prevState;
      return { ...prevState, isTerminalFocused: isFocused };
    });
  };

  handleExit = (error?: Error) => {
    if (this.isRawModeSupported()) {
      this.handleSetRawMode(false);
    }
    this.props.onExit(error);
  };

  // Focus management methods
  enableFocus = () => this.setState({ isFocusEnabled: true });
  disableFocus = () => this.setState({ isFocusEnabled: false });

  focus = (id: string) => {
    this.setState((state) => {
      if (!state.focusables.some((f) => f.id === id)) return null;
      return { activeFocusId: id };
    });
  };

  focusNext = () => {
    this.setState((state) => {
      const nextId = this.findNextFocusable(state);
      const firstActiveId = state.focusables.find((f) => f.isActive)?.id;
      return { activeFocusId: nextId ?? firstActiveId };
    });
  };

  focusPrevious = () => {
    this.setState((state) => {
      const prevId = this.findPreviousFocusable(state);
      const lastActiveId = [...state.focusables].reverse().find((f) => f.isActive)?.id;
      return { activeFocusId: prevId ?? lastActiveId };
    });
  };

  addFocusable = (id: string, { autoFocus }: { autoFocus?: boolean }) => {
    this.setState((state) => {
      let activeFocusId = state.activeFocusId;
      if (!activeFocusId && autoFocus) activeFocusId = id;
      return {
        activeFocusId,
        focusables: [...state.focusables, { id, isActive: true }],
      };
    });
  };

  removeFocusable = (id: string) => {
    this.setState((state) => ({
      activeFocusId: state.activeFocusId === id ? undefined : state.activeFocusId,
      focusables: state.focusables.filter((f) => f.id !== id),
    }));
  };

  activateFocusable = (id: string) => {
    this.setState((state) => ({
      focusables: state.focusables.map((f) => (f.id === id ? { ...f, isActive: true } : f)),
    }));
  };

  deactivateFocusable = (id: string) => {
    this.setState((state) => ({
      activeFocusId: state.activeFocusId === id ? undefined : state.activeFocusId,
      focusables: state.focusables.map((f) => (f.id === id ? { ...f, isActive: false } : f)),
    }));
  };

  private findNextFocusable(state: InternalAppState): string | undefined {
    const currentIndex = state.focusables.findIndex((f) => f.id === state.activeFocusId);
    for (let i = currentIndex + 1; i < state.focusables.length; i++) {
      const f = state.focusables[i];
      if (f?.isActive) return f.id;
    }
    return undefined;
  }

  private findPreviousFocusable(state: InternalAppState): string | undefined {
    const currentIndex = state.focusables.findIndex((f) => f.id === state.activeFocusId);
    for (let i = currentIndex - 1; i >= 0; i--) {
      const f = state.focusables[i];
      if (f?.isActive) return f.id;
    }
    return undefined;
  }

  render() {
    const { terminalColumns, terminalRows, ink2, stdin, exitOnCtrlC, initialTheme, children } = this.props;

    return (
      <TerminalDimensionsContext.Provider value={{ columns: terminalColumns, rows: terminalRows }}>
        <InkContext.Provider value={ink2}>
          <ExitContext.Provider value={{ exit: this.handleExit }}>
            <ThemeContext.Provider value={{ theme: initialTheme, setTheme: () => {} }}>
              <StdinContext.Provider
                value={{
                  stdin,
                  setRawMode: this.handleSetRawMode,
                  isRawModeSupported: this.isRawModeSupported(),
                  internal_exitOnCtrlC: exitOnCtrlC,
                  internal_eventEmitter: this.internal_eventEmitter,
                }}
              >
                <FocusContext.Provider
                  value={{
                    activeId: this.state.activeFocusId,
                    add: this.addFocusable,
                    remove: this.removeFocusable,
                    activate: this.activateFocusable,
                    deactivate: this.deactivateFocusable,
                    enableFocus: this.enableFocus,
                    disableFocus: this.disableFocus,
                    focusNext: this.focusNext,
                    focusPrevious: this.focusPrevious,
                    focus: this.focus,
                  }}
                >
                  <TerminalFocusContext.Provider value={{ isTerminalFocused: this.state.isTerminalFocused }}>
                    {this.state.error ? (
                      <Box padding={1} flexDirection="column">
                        <Text color="red">Internal Error: {this.state.error.message}</Text>
                      </Box>
                    ) : (
                      children
                    )}
                  </TerminalFocusContext.Provider>
                </FocusContext.Provider>
              </StdinContext.Provider>
            </ThemeContext.Provider>
          </ExitContext.Provider>
        </InkContext.Provider>
      </TerminalDimensionsContext.Provider>
    );
  }
}
