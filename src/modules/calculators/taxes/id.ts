import { ID } from '../../../rules/id';

export class IDCalculator {
  static getIDAmount(income: number, year: string): number {
    const rate = ID?.[year] ?? ID.not_found;
    return income * rate;
  }
}
