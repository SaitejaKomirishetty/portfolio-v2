'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type Operator = '+' | '-' | '*' | '/';

/** Internal machine state for a chaining four-function calculator. */
interface CalcState {
  /** The string currently shown / being typed. */
  display: string;
  /** The accumulated left-hand operand (null until an operator is pressed). */
  accumulator: number | null;
  /** The pending operator awaiting its right-hand operand. */
  operator: Operator | null;
  /** True when the next digit should start a fresh entry (after an operator/equals). */
  overwrite: boolean;
  /** True once an unrecoverable error (e.g. /0) occurred — only AC recovers. */
  error: boolean;
}

const INITIAL: CalcState = {
  display: '0',
  accumulator: null,
  operator: null,
  overwrite: true,
  error: false,
};

const MAX_DIGITS = 15;

function applyOp(a: number, b: number, op: Operator): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
  }
}

/** Parse the visible display (which may contain grouping separators) to a number. */
function displayToNumber(display: string): number {
  return Number.parseFloat(display.replace(/,/g, ''));
}

/**
 * Format a numeric result for display: group large integers with commas,
 * keep reasonable precision for decimals, and avoid floating point noise.
 */
function formatResult(value: number): string {
  if (!Number.isFinite(value)) return 'Error';

  // Trim floating point error to ~12 significant digits, then re-parse.
  const cleaned = Number.parseFloat(value.toPrecision(12));

  if (Number.isInteger(cleaned)) {
    // Fall back to exponential for numbers too large to show in full.
    if (Math.abs(cleaned) >= 1e15) return cleaned.toExponential(5);
    return cleaned.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  const [intPart, fracPart = ''] = String(cleaned).split('.');
  const sign = intPart.startsWith('-') ? '-' : '';
  const intDigits = sign ? intPart.slice(1) : intPart;
  const grouped = Number(intDigits).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
  return `${sign}${grouped}.${fracPart}`;
}

export function Calculator() {
  const [state, setState] = useState<CalcState>(INITIAL);

  const inputDigit = useCallback((digit: string) => {
    setState((s) => {
      if (s.error) return s;
      if (s.overwrite) {
        return { ...s, display: digit, overwrite: false };
      }
      const raw = s.display.replace(/,/g, '');
      const digitCount = raw.replace(/[-.]/g, '').length;
      if (digitCount >= MAX_DIGITS) return s;
      const next = raw === '0' ? digit : raw + digit;
      return { ...s, display: formatTyped(next) };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((s) => {
      if (s.error) return s;
      if (s.overwrite) {
        return { ...s, display: '0.', overwrite: false };
      }
      const raw = s.display.replace(/,/g, '');
      if (raw.includes('.')) return s;
      return { ...s, display: `${raw}.` };
    });
  }, []);

  const clear = useCallback(() => {
    setState((s) => {
      if (s.error) return INITIAL;
      // When a number is being entered, AC acts as C: clear the entry only.
      if (!s.overwrite) {
        return { ...s, display: '0', overwrite: true };
      }
      return INITIAL;
    });
  }, []);

  const negate = useCallback(() => {
    setState((s) => {
      if (s.error || s.display === '0') return s;
      const raw = s.display.replace(/,/g, '');
      const negated = raw.startsWith('-') ? raw.slice(1) : `-${raw}`;
      return { ...s, display: formatTyped(negated) };
    });
  }, []);

  const percent = useCallback(() => {
    setState((s) => {
      if (s.error) return s;
      const value = displayToNumber(s.display) / 100;
      return { ...s, display: formatResult(value), overwrite: true };
    });
  }, []);

  const backspace = useCallback(() => {
    setState((s) => {
      if (s.error || s.overwrite) return s;
      const raw = s.display.replace(/,/g, '');
      const next = raw.slice(0, -1);
      if (next === '' || next === '-') {
        return { ...s, display: '0', overwrite: true };
      }
      return { ...s, display: formatTyped(next) };
    });
  }, []);

  const chooseOperator = useCallback((nextOp: Operator) => {
    setState((s) => {
      if (s.error) return s;
      const current = displayToNumber(s.display);

      // If an operator was just pressed (overwrite) and there's a pending op,
      // just swap the operator without computing.
      if (s.overwrite && s.accumulator !== null) {
        return { ...s, operator: nextOp };
      }

      if (s.accumulator === null) {
        return {
          ...s,
          accumulator: current,
          operator: nextOp,
          overwrite: true,
        };
      }

      if (s.operator) {
        const result = applyOp(s.accumulator, current, s.operator);
        if (!Number.isFinite(result)) {
          return { ...INITIAL, display: 'Error', error: true };
        }
        return {
          ...s,
          accumulator: result,
          display: formatResult(result),
          operator: nextOp,
          overwrite: true,
        };
      }

      return { ...s, operator: nextOp, overwrite: true };
    });
  }, []);

  const equals = useCallback(() => {
    setState((s) => {
      if (s.error || s.operator === null || s.accumulator === null) return s;
      const current = displayToNumber(s.display);
      const result = applyOp(s.accumulator, current, s.operator);
      if (!Number.isFinite(result)) {
        return { ...INITIAL, display: 'Error', error: true };
      }
      return {
        ...INITIAL,
        display: formatResult(result),
        overwrite: true,
      };
    });
  }, []);

  // Full keyboard support, scoped to mount lifetime.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        inputDigit(key);
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        chooseOperator(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        equals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        clear();
      } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (key === '%') {
        e.preventDefault();
        percent();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    inputDigit,
    inputDecimal,
    chooseOperator,
    equals,
    clear,
    backspace,
    percent,
  ]);

  // Shrink the display font as the number gets longer so it never overflows.
  const displayFontSize = useMemo(() => {
    const len = state.display.length;
    if (len <= 6) return 'text-6xl';
    if (len <= 9) return 'text-5xl';
    if (len <= 12) return 'text-4xl';
    return 'text-3xl';
  }, [state.display]);

  const acLabel = !state.overwrite && !state.error ? 'C' : 'AC';
  const activeOp = state.operator !== null && state.overwrite ? state.operator : null;

  return (
    <div className="flex h-full flex-col bg-black text-white no-select">
      {/* Display */}
      <div className="flex flex-1 items-end justify-end px-5 pb-3 pt-6">
        <div
          className={cn(
            'w-full truncate text-right font-light leading-none tabular-nums transition-[font-size] duration-100',
            displayFontSize,
          )}
          aria-live="polite"
          role="status"
        >
          {state.display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2 p-3">
        <Key label={acLabel} variant="function" onPress={clear} ariaLabel={acLabel === 'C' ? 'Clear entry' : 'All clear'} />
        <Key label="+/-" variant="function" onPress={negate} ariaLabel="Toggle sign" />
        <Key label="%" variant="function" onPress={percent} ariaLabel="Percent" />
        <Key label="÷" variant="operator" active={activeOp === '/'} onPress={() => chooseOperator('/')} ariaLabel="Divide" />

        <Key label="7" variant="digit" onPress={() => inputDigit('7')} />
        <Key label="8" variant="digit" onPress={() => inputDigit('8')} />
        <Key label="9" variant="digit" onPress={() => inputDigit('9')} />
        <Key label="×" variant="operator" active={activeOp === '*'} onPress={() => chooseOperator('*')} ariaLabel="Multiply" />

        <Key label="4" variant="digit" onPress={() => inputDigit('4')} />
        <Key label="5" variant="digit" onPress={() => inputDigit('5')} />
        <Key label="6" variant="digit" onPress={() => inputDigit('6')} />
        <Key label="−" variant="operator" active={activeOp === '-'} onPress={() => chooseOperator('-')} ariaLabel="Subtract" />

        <Key label="1" variant="digit" onPress={() => inputDigit('1')} />
        <Key label="2" variant="digit" onPress={() => inputDigit('2')} />
        <Key label="3" variant="digit" onPress={() => inputDigit('3')} />
        <Key label="+" variant="operator" active={activeOp === '+'} onPress={() => chooseOperator('+')} ariaLabel="Add" />

        <Key label="0" variant="digit" wide onPress={() => inputDigit('0')} />
        <Key label="." variant="digit" onPress={inputDecimal} ariaLabel="Decimal point" />
        <Key label="=" variant="operator" onPress={equals} ariaLabel="Equals" />
      </div>
    </div>
  );
}

interface KeyProps {
  label: string;
  variant: 'function' | 'digit' | 'operator';
  onPress: () => void;
  wide?: boolean;
  active?: boolean;
  ariaLabel?: string;
}

function Key({ label, variant, onPress, wide, active, ariaLabel }: KeyProps) {
  const base =
    'flex h-14 items-center justify-center rounded-full text-2xl font-medium transition-[filter,background-color,color] duration-75 active:scale-95 active:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/80';

  const variantClass =
    variant === 'function'
      ? 'bg-[#a5a5a5] text-black hover:brightness-105'
      : variant === 'operator'
        ? active
          ? 'bg-white text-[#ff9f0a]'
          : 'bg-[#ff9f0a] text-white hover:brightness-110'
        : 'bg-[#333333] text-white hover:brightness-125';

  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={ariaLabel ?? label}
      className={cn(base, variantClass, wide && 'col-span-2 justify-start pl-7')}
    >
      {label}
    </button>
  );
}

/** Group the integer portion of a freshly typed number string with commas. */
function formatTyped(raw: string): string {
  const sign = raw.startsWith('-') ? '-' : '';
  const unsigned = sign ? raw.slice(1) : raw;
  const [intPart, fracPart] = unsigned.split('.');
  const grouped =
    intPart === '' ? '' : Number(intPart).toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (fracPart !== undefined) {
    return `${sign}${grouped || '0'}.${fracPart}`;
  }
  return `${sign}${grouped}`;
}
