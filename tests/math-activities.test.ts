import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  clockChoices,
  decimalComparison,
  distinctNumbers,
  formatClockTime,
  fractionSectorPath,
  isExactWholeNumberAnswer,
  repeatingPattern,
} from '../lib/math-activities';

test('whole-number activities do not accept a truncated fractional or malformed answer', () => {
  for (const input of ['2.9', '2oops', '', ' ', 'NaN', 'Infinity', '9007199254740993']) {
    assert.equal(isExactWholeNumberAnswer(input, 2), false, input);
  }
  assert.equal(isExactWholeNumberAnswer('2', 2), true);
  assert.equal(isExactWholeNumberAnswer('2.0', 2), true);
  assert.equal(isExactWholeNumberAnswer('0', 0), true);
  assert.equal(isExactWholeNumberAnswer('3', 2), false);
});

test('new color and shape patterns include the current next symbol, with no blank or duplicate choices', () => {
  for (const symbols of [['🔴', '🔵', '🟡', '🟢', '🟣', '🟠'], ['⭐', '🔷', '🔶', '⬛', '🔺', '⬜']]) {
    const original = [...symbols];
    for (const constant of [0, 0.25, 0.75, 0.999]) {
      const question = repeatingPattern(symbols, () => constant);
      const expected = question.pattern[0] === question.pattern[2] ? question.pattern[1] : question.pattern[2];
      assert.equal(question.answer, expected);
      assert.equal(question.pattern.length, 5);
      assert.equal(question.options.length, 3);
      assert.equal(new Set(question.options).size, 3);
      assert.ok(question.options.includes(question.answer));
      assert.ok(question.options.every(value => symbols.includes(value)));
    }
    assert.deepEqual(symbols, original, 'generation must not mutate the symbol library');
  }
});

test('comparison and ordering number selection terminates with distinct numbers when RNG repeats', () => {
  for (const maximum of [10, 50, 100]) {
    for (const constant of [0, 0.5, 0.999]) {
      const values = distinctNumbers(3, maximum, () => constant);
      assert.equal(values.length, 3);
      assert.equal(new Set(values).size, 3);
      assert.ok(values.every(value => value >= 1 && value <= maximum));
    }
  }
  assert.throws(() => distinctNumbers(3, 2), RangeError);
});

test('decimal comparison offers Equal when the displayed values are equal and keeps answers unique', () => {
  for (const [first, second, expected] of [[1.2, 1.2, 'Equal'], [1.2, 1.3, '1.3 is greater'], [1.3, 1.2, '1.3 is greater']] as const) {
    const question = decimalComparison(first, second, () => 0);
    assert.equal(question.answer, expected);
    assert.ok(question.options.includes(expected));
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(question.options.includes('Equal'));
  }
});

test('clock distractors are bounded, unique, and do not claim an unknowable AM/PM period', () => {
  for (const hourOnly of [false, true]) {
    for (const hour of [1, 6, 12]) {
      const minute = hourOnly ? 0 : 30;
      const choices = clockChoices(hour, minute, hourOnly, () => 0);
      assert.equal(choices.length, 3);
      assert.equal(new Set(choices).size, 3);
      assert.ok(choices.includes(formatClockTime(hour, minute)));
      assert.ok(choices.every(choice => /^\d{1,2}:\d{2}$/.test(choice)));
      if (hourOnly) assert.ok(choices.every(choice => choice.endsWith(':00')));
    }
  }
});

test('pizza halves, thirds, and quarters are connected equal-angle circle sectors', () => {
  for (const parts of [2, 3, 4]) {
    const sectors = Array.from({ length: parts }, (_, index) => fractionSectorPath(index, parts));
    const points = sectors.map(path => {
      const match = /^M 128 128 L ([\d.-]+) ([\d.-]+) A 116 116 0 0 1 ([\d.-]+) ([\d.-]+) Z$/.exec(path);
      assert.ok(match, 'fraction must contain a circular arc, not a triangular approximation');
      return match.slice(1).map(Number);
    });
    points.forEach(([startX, startY, endX, endY], index) => {
      const next = points[(index + 1) % parts];
      assert.ok(Math.abs(endX - next[0]) < 0.0001);
      assert.ok(Math.abs(endY - next[1]) < 0.0001);
      assert.ok(Math.abs(Math.hypot(startX - 128, startY - 128) - 116) < 0.001);
      const normalizedDot = ((startX - 128) * (endX - 128) + (startY - 128) * (endY - 128)) / (116 * 116);
      assert.ok(Math.abs(normalizedDot - Math.cos(Math.PI * 2 / parts)) < 0.001);
    });
  }
});
