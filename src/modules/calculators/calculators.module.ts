import { Module } from '@nestjs/common';

import { CalculatorController } from './controllers/calculator.controller';
import { CalculatorsService } from './services/calculator.service';

@Module({
  imports: [],
  controllers: [CalculatorController],
  providers: [CalculatorsService],
  exports: [],
})
export class CalculatorsModule {}
