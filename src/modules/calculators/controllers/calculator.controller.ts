import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CalculatorDto } from '../dtos/calculator.dto';
import { CalculatorsService } from '../services/calculator.service';

@ApiTags('Calculator')
@Controller('calculator')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorsService) {}

  @Post('best-monthly-simulation')
  calculateBestMonthlySimulation(@Body() calculatorDto: CalculatorDto) {
    // console.log('Received calculatorDto:', calculatorDto.employees);

    return this.calculatorService.findBestMonthlyIncomeForExpenses(
      calculatorDto.nonTaxableBonus,
      calculatorDto.companyMonthlyIncome,
      calculatorDto.taxDate,
      [calculatorDto.nonTaxableExpense],
      calculatorDto.employees,
    );
  }
}
