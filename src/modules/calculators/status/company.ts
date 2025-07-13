import { Employee } from '../../../types/employee';
import { CnssCalculators } from '../taxes/cnss';
import { IDCalculator } from '../taxes/id';
import { IrCalculator } from '../taxes/ir';
import { ISCalculator } from '../taxes/is';
import { SalaryCalculator } from './salary';

export class CompanyCalculator {
  private NON_TAXABLE_EXPENSES: number[] = [];

  constructor(
    private readonly monthlyIncome: number,
    private readonly ownerAsEmployee: Employee,
    private readonly taxYear: string,
  ) {}

  addNonTaxableExpense(expense: number): void {
    if (expense < 0) {
      throw new Error('Non-taxable expense cannot be negative.');
    }
    this.NON_TAXABLE_EXPENSES.push(expense);
  }

  getYearlyIncome(): number {
    return this.monthlyIncome * 12;
  }

  // Ir + CNSS
  getEmployeeMonthlyTaxes(): number {
    const cnss = CnssCalculators.getTotalCnss(this.ownerAsEmployee.grossSalary);
    const ir = IrCalculator.getTotalIr(this.ownerAsEmployee.grossSalary);
    return cnss + ir;
  }

  getEmployeeMonthlyNetSalaryWithBonus(): number {
    const netSalary = SalaryCalculator.getNetSalary(this.ownerAsEmployee);
    return netSalary + this.ownerAsEmployee.nonTaxableBonus;
  }

  getYearlyEmployeeTotalExpenses(): number {
    const monthlyNetSalaryWithBonus =
      this.getEmployeeMonthlyNetSalaryWithBonus();
    const monthlyTaxes = this.getEmployeeMonthlyTaxes();
    const monthlyNonTaxableExpenses = this.NON_TAXABLE_EXPENSES.reduce(
      (accumulator, expense) => accumulator + expense,
      0,
    );
    const monthlyTotalExpenses =
      monthlyNetSalaryWithBonus + monthlyTaxes + monthlyNonTaxableExpenses;
    return monthlyTotalExpenses * 12;
  }

  getYearlyProfit(): number {
    const yearlyIncome = this.getYearlyIncome();
    const yearlyExpenses = this.getYearlyEmployeeTotalExpenses();
    return yearlyIncome - yearlyExpenses;
  }

  getCompanyTaxes(): number {
    const yearlyProfit = this.getYearlyProfit();
    const IS =
      yearlyProfit <= 0
        ? 0
        : ISCalculator.getISAmount(yearlyProfit, this.taxYear);
    const yearlyProfitWithoutIS = yearlyProfit - IS;
    const ID = IDCalculator.getIDAmount(yearlyProfitWithoutIS, this.taxYear);
    return IS + ID;
  }

  getCombinedProfitAfterTaxes(): number {
    const yearlyProfit = this.getYearlyProfit();
    const companyTaxes = this.getCompanyTaxes();
    const employeeYearlyNetIncomeWithBonus =
      this.getEmployeeMonthlyNetSalaryWithBonus() * 12;
    return yearlyProfit + employeeYearlyNetIncomeWithBonus - companyTaxes;
  }

  getMarginalProfitRate(): number {
    const totalincome = this.getYearlyIncome();
    const combinedProfit = this.getCombinedProfitAfterTaxes();
    return Math.round((combinedProfit / totalincome) * 1000000000) / 10000000;
  }
}
