import { CNSS } from '../../../rules/cnss';

export class CnssCalculators {
  static getTotalCnss(grossSalary: number): number {
    const [employeeContribution, employerContribution] =
      this.getCnssContribution(grossSalary);
    return employeeContribution + employerContribution;
  }

  static getCnssContribution(salary: number): [number, number] {
    const employeeContribution = this.getCnssemployeeContribution(salary);
    const employerContribution = this.getCnssEmployerContribution(salary);
    return [employeeContribution, employerContribution];
  }

  static getCnssemployeeContribution(grossSalary: number): number {
    if (grossSalary < 6000) {
      return (
        grossSalary * (CNSS.employeePart.max_6000 + CNSS.employeePart.no_max)
      );
    } else {
      return (
        6000 * CNSS.employeePart.max_6000 +
        grossSalary * CNSS.employeePart.no_max
      );
    }
  }

  static getCnssEmployerContribution(grossSalary: number): number {
    if (grossSalary < 6000) {
      return (
        grossSalary * (CNSS.employerPart.max_6000 + CNSS.employerPart.no_max)
      );
    } else {
      return (
        6000 * CNSS.employerPart.max_6000 +
        grossSalary * CNSS.employerPart.no_max
      );
    }
  }
}
