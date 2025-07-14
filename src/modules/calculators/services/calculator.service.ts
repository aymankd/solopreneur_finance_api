import { Injectable } from '@nestjs/common';

import { Employee } from '../../../types/employee';
import { CompanyCalculator } from '../status/company';

@Injectable()
export class CalculatorsService {
  constructor() {}

  findBestMonthlyIncomeForExpenses(
    nonTaxableBonus: number,
    companyMonthlyIncome: number,
    taxDate: string,
    nonTaxableExpenses: number[] = [],
    employees: Employee[] = [],
  ) {
    const sumOfNonTaxableExpenses = nonTaxableExpenses.reduce(
      (accumulator, expense) => accumulator + expense,
      0,
    );
    const isProfitable = companyMonthlyIncome - sumOfNonTaxableExpenses;
    if (isProfitable <= 0) {
      throw new Error(
        'Company income must be greater than non-taxable expenses.',
      );
    }
    const startSalary = 3333,
      endSalary = (companyMonthlyIncome - sumOfNonTaxableExpenses) / 0.9;

    const salaries = Array.from(
      { length: endSalary - startSalary + 1 },
      (_, index) => startSalary + index,
    );
    const companiesProfit: [
      number,
      {
        netOwnerSalary: number;
        yearlyProfit: number;
        totalTaxes: number;
        netProfit: number;
        profitMarging: number;
      },
    ][] = [];

    salaries.forEach((salary) => {
      const companyCalc = this.getCompanyCalculator(
        companyMonthlyIncome,
        {
          grossSalary: salary,
          nonTaxableBonus,
        },
        taxDate,
        nonTaxableExpenses,
        employees,
      );
      const netOwnerSalary = companyCalc.getEmployeeMonthlyNetSalary(),
        yearlyProfit = companyCalc.getYearlyProfit(),
        totalTaxes = companyCalc.getCompanyTaxes(),
        netProfit = companyCalc.getNetProfitAfterTaxes(),
        profitMarging = companyCalc.getMarginalProfitRate();
      if (netProfit > 0)
        companiesProfit.push([
          salary,
          {
            netOwnerSalary,
            yearlyProfit,
            totalTaxes,
            netProfit,
            profitMarging,
          },
        ]);
    });

    companiesProfit.sort((a, b) => b[1].profitMarging - a[1].profitMarging);
    console.log('companiesProfit: ', companiesProfit);

    const bestSimulation = companiesProfit[0];
    return {
      grossSalary: bestSimulation[0],
      ...bestSimulation[1],
    };
  }

  getCompanyCalculator(
    monthlyIncome: number,
    ownerAsEmployee: Employee,
    taxYear: string,
    nonTaxableExpenses: number[],
    employees: Employee[] = [],
  ) {
    const compCalc = new CompanyCalculator(
      monthlyIncome,
      ownerAsEmployee,
      taxYear,
      employees,
    );
    nonTaxableExpenses.forEach((expense) => {
      compCalc.addNonTaxableExpense(expense);
    });
    return compCalc;
  }
}
