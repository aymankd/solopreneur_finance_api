export type IrType = {
  from: number;
  to: number;
  rate: number;
  deduction: number;
};

export type IDType = {
  [year: string]: number;
  not_found: number;
};

type IsValue = {
  from: number;
  to: number;
  rate: number;
};

export type IsType = {
  [year: string]: IsValue[];
  not_found: IsValue[];
};
