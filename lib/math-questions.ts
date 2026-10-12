// Always terminates, including a correct answer of zero or an RNG repeatedly returning the same value.
export function numericOptions(answer: number, count = 4): number[] {
  const options = [answer];
  for (let offset = 1; options.length < count; offset++) {
    options.push(answer + offset);
    if (options.length < count && answer - offset >= 0) options.push(answer - offset);
  }
  return options.sort(() => Math.random() - 0.5);
}

export function placeValueAnswer(number: number, place: 'ones' | 'tens' | 'hundreds' | 'expanded-form'): string {
  const ones = number % 10;
  const tens = Math.floor((number % 100) / 10);
  const hundreds = Math.floor(number / 100);
  if (place === 'ones') return String(ones);
  if (place === 'tens') return String(tens);
  if (place === 'hundreds') return String(hundreds);
  return `${hundreds * 100} + ${tens * 10} + ${ones}`;
}
