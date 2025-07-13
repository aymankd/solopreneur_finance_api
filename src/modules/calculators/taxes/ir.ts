import { IR } from '../../../rules/ir';
import { CnssCalculators } from './cnss';

export class IrCalculator {
  static getTotalIr(grossSalary: number): number {
    const baseIr = this.getBaseIr(grossSalary);
    const bracket = IR.find((b) => baseIr >= b.from && baseIr <= b.to);

    if (!bracket) {
      throw new Error('Amount out of IR brackets range');
    }

    return baseIr * bracket.rate - bracket.deduction;
  }

  static getProfExpenses(grossSalary: number): number {
    if (grossSalary > 6500) {
      return Math.min(0.25 * grossSalary, 2917);
    } else {
      return 0.35 * grossSalary;
    }
  }

  static getBaseIr(grossSalary: number): number {
    return (
      grossSalary -
      CnssCalculators.getCnssemployeeContribution(grossSalary) -
      this.getProfExpenses(grossSalary)
    );
  }
}
