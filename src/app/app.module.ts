import { appConfig } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CalculatorsModule } from '../modules/calculators/calculators.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    CalculatorsModule,
  ],
})
export class AppModule {}
