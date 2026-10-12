export function isExactWholeNumberAnswer(input: string, answer: number): boolean {
  const value = Number(input);
  return input.trim() !== '' && Number.isSafeInteger(value) && value === answer;
}

export function shuffleChoices<T>(values: readonly T[], random = Math.random): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

// Select without rejection sampling, so even a repeating RNG cannot hang a lesson.
export function distinctNumbers(count: number, maximum: number, random = Math.random): number[] {
  if (!Number.isSafeInteger(count) || !Number.isSafeInteger(maximum) || count < 1 || maximum < count) {
    throw new RangeError('Invalid number selection');
  }
  return shuffleChoices(Array.from({ length: maximum }, (_, index) => index + 1), random).slice(0, count);
}

export function repeatingPattern(items: readonly string[], random = Math.random) {
  const symbols = shuffleChoices(items, random).slice(0, 3);
  const period = random() > 0.5 ? 2 : 3;
  const pattern = Array.from({ length: 5 }, (_, index) => symbols[index % period]);
  const answer = symbols[pattern.length % period];
  const options = shuffleChoices([answer, ...items.filter(item => item !== answer).slice(0, 2)], random);
  return { pattern, answer, options };
}

export function decimalComparison(first: number, second: number, random = Math.random) {
  const firstLabel = `${first.toFixed(1)} is greater`;
  const secondLabel = `${second.toFixed(1)} is greater`;
  const answer = first > second ? firstLabel : second > first ? secondLabel : 'Equal';
  const options = shuffleChoices([...new Set([firstLabel, secondLabel, 'Equal'])], random);
  return { answer, options };
}

export function formatClockTime(hour: number, minute: number): string {
  return `${hour}:${String(minute).padStart(2, '0')}`;
}

export function clockChoices(hour: number, minute: number, hourOnly: boolean, random = Math.random): string[] {
  const answer = formatClockTime(hour, minute);
  const minutes = hourOnly ? [0] : [0, 15, 30, 45];
  const candidates = Array.from({ length: 12 }, (_, index) => index + 1)
    .flatMap(candidateHour => minutes.map(candidateMinute => formatClockTime(candidateHour, candidateMinute)))
    .filter(value => value !== answer);
  return shuffleChoices([answer, ...shuffleChoices(candidates, random).slice(0, 2)], random);
}

export function fractionSectorPath(index: number, parts: number): string {
  const point = (angle: number) => [128 + 116 * Math.cos(angle), 128 + 116 * Math.sin(angle)].map(value => value.toFixed(4)).join(' ');
  const start = (index / parts) * Math.PI * 2 - Math.PI / 2;
  const end = ((index + 1) / parts) * Math.PI * 2 - Math.PI / 2;
  return `M 128 128 L ${point(start)} A 116 116 0 0 1 ${point(end)} Z`;
}
