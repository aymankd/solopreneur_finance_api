import { Employee } from '../../../types/employee';
import { CnssCalculators } from '../taxes/cnss';
import { IrCalculator } from '../taxes/ir';

export class SalaryCalculator {
  static getNetSalary(
    employee: Employee,
    ir: number = IrCalculator.getTotalIr(employee.grossSalary),
    employeeCnss: number = CnssCalculators.getCnssemployeeContribution(
      employee.grossSalary,
    ),
  ): number {
    return employee.grossSalary - ir - employeeCnss;
  }

  static getNetWithBonusSalary(
    employee: Employee,
    ir: number = IrCalculator.getTotalIr(employee.grossSalary),
    cnss: number = CnssCalculators.getTotalCnss(employee.grossSalary),
  ): number {
    return this.getNetSalary(employee, ir, cnss) + employee.nonTaxableBonus;
  }
}
