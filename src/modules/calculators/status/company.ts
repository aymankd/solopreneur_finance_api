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
    private readonly employees: Employee[] = [],
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
  getEmployeeMonthlyTaxes(employee = this.ownerAsEmployee): number {
    const cnss = CnssCalculators.getTotalCnss(employee.grossSalary);
    const ir = IrCalculator.getTotalIr(employee.grossSalary);
    return cnss + ir;
  }

  getEmployeeMonthlyNetSalaryWithBonus(
    employee = this.ownerAsEmployee,
  ): number {
    const netSalary = this.getEmployeeMonthlyNetSalary(employee);
    return netSalary + employee.nonTaxableBonus;
  }

  getEmployeeMonthlyNetSalary(employee = this.ownerAsEmployee): number {
    return SalaryCalculator.getNetSalary(employee);
  }

  getYearlyEmployeeTotalExpensesWithSalary(): number {
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
    const yearlyOwnerEmployeeExpenses =
      this.getYearlyEmployeeTotalExpensesWithSalary();
    const yearlyEmployeesExpenses =
      this.getYearlyEmployeesTaxExpensesWithSalaries();
    // console.log(
    //   `${yearlyIncome} - ${yearlyOwnerEmployeeExpenses} - ${yearlyEmployeesExpenses}`,
    // );

    return yearlyIncome - yearlyOwnerEmployeeExpenses - yearlyEmployeesExpenses;
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

  getCompanyMonthlyEmployeesTaxExpenses(): number {
    return this.employees.reduce((total, employee) => {
      return total + this.getEmployeeMonthlyTaxes(employee);
    }, 0);
  }

  getEmployeesSalaryExpensesWithBonus(): number {
    return this.employees.reduce((total, employee) => {
      return total + SalaryCalculator.getNetWithBonusSalary(employee);
    }, 0);
  }

  getMonthlyEmployeesTaxExpensesWithSalaries(): number {
    return (
      this.getCompanyMonthlyEmployeesTaxExpenses() +
      this.getEmployeesSalaryExpensesWithBonus()
    );
  }

  getYearlyEmployeesTaxExpensesWithSalaries(): number {
    return this.getMonthlyEmployeesTaxExpensesWithSalaries() * 12;
  }

  getNetProfitAfterTaxes(): number {
    const yearlyProfit = this.getYearlyProfit();
    const companyTaxes = this.getCompanyTaxes();
    return yearlyProfit - companyTaxes;
  }

  getMarginalProfitRate(): number {
    const totalincome = this.getYearlyIncome();
    const netProfit = this.getNetProfitAfterTaxes();
    return Math.round((netProfit / totalincome) * 1000000000) / 10000000;
  }
}
