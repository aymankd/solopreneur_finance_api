import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class EmployeeDto {
  @IsDefined()
  @IsNumber()
  @Expose()
  @ApiProperty({
    type: Number,
    name: 'grossSalary',
    required: true,
    example: 3000,
    description: 'The gross salary of the employee',
  })
  grossSalary!: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  @Expose()
  @ApiProperty({
    type: Number,
    name: 'nonTaxableBonus',
    required: false,
    example: 3000,
    description: 'The non-taxable bonus of the employee',
  })
  nonTaxableBonus!: number;
}

export class CalculatorDto {
  @IsDefined()
  @IsNumber()
  @Expose()
  @ApiProperty({
    type: Number,
    name: 'companyMonthlyIncome',
    required: true,
    example: 50000,
    description: 'The monthly income of the company',
  })
  companyMonthlyIncome!: number;

  @IsDefined()
  @IsNumber()
  @Expose()
  @ApiProperty({
    type: Number,
    name: 'nonTaxableBonus',
    required: true,
    example: 1000,
    description: 'The non-taxable bonus for owner as employee',
  })
  nonTaxableBonus!: number;

  @IsDefined()
  @IsNumber()
  @Min(2023, { message: 'Year must be 2023 or later' })
  @Expose()
  @ApiProperty({
    type: String,
    name: 'taxDate',
    required: true,
    example: '2023-01-01',
    description: 'The date for tax calculations in YYYY format',
  })
  taxDate!: string;

  @IsDefined()
  @IsNumber()
  @Expose()
  @ApiProperty({
    type: Number,
    name: 'nonTaxableExpense',
    required: true,
    example: 5000,
    description: 'The total non-taxable expense for the company',
  })
  nonTaxableExpense!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmployeeDto)
  @Expose()
  @ApiProperty({
    type: [EmployeeDto],
    name: 'employees',
    required: false,
    description: 'List of employees with their gross salaries and bonuses',
  })
  employees?: EmployeeDto[];
}
