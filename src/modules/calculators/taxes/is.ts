import { IS } from '../../../rules/is';

export class ISCalculator {
  static getISAmount(income: number, year: string): number {
    const brackets = IS[year] ?? IS.not_found;
    let rate = brackets[brackets.length - 1].rate;
    for (let index = 0; index < brackets.length - 1; index++) {
      const bracket = brackets[index];
      if (income >= bracket.from && income <= bracket.to) {
        rate = bracket.rate;
      }
    }
    return income * rate;
  }
}
