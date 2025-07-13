import { IrType } from '../types/taxes';

// Annual Income Tax (IR) brackets
const ANNUAL_IR: IrType[] = [
  {
    from: 0,
    to: 40000,
    rate: 0,
    deduction: 0,
  },
  {
    from: 40001,
    to: 60000,
    rate: 0.1,
    deduction: 4000,
  },
  {
    from: 60001,
    to: 80000,
    rate: 0.2,
    deduction: 10000,
  },
  {
    from: 80001,
    to: 100000,
    rate: 0.3,
    deduction: 18000,
  },
  {
    from: 100001,
    to: 180000,
    rate: 0.34,
    deduction: 22000,
  },
  {
    from: 180001,
    to: Infinity,
    rate: 0.38,
    deduction: 27400,
  },
];

export const IR = ANNUAL_IR.map(
  (bracket) =>
    ({
      from: bracket.from / 12,
      to: bracket.to === Infinity ? Infinity : bracket.to / 12,
      rate: bracket.rate,
      deduction: bracket.deduction / 12,
    }) as IrType,
);
