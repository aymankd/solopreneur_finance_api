import { IsType } from 'src/types/taxes';

// The IS tax rates for different years, represented as a percentage of the taxable income
const IS_FROM_TO = [
  [0, 300000],
  [300000, 1000000],
  [1000000, Infinity],
] as const;
const IS_DATA = {
  2023: [12.5 / 100, 20 / 100, 23.75 / 100],
  2024: [15 / 100, 20 / 100, 27.5 / 100],
  2025: [17.5 / 100, 20 / 100, 31.5 / 100],
  2026: [20 / 100, 20 / 100, 35 / 100],
  not_found: [20 / 100, 20 / 100, 35 / 100],
};

export const IS = Object.entries(IS_DATA).reduce(
  (accumulator, [year, rates]) => {
    accumulator[year] = [
      {
        from: IS_FROM_TO[0][0],
        to: IS_FROM_TO[0][1],
        rate: rates[0],
      },
      {
        from: IS_FROM_TO[1][0],
        to: IS_FROM_TO[1][1],
        rate: rates[1],
      },
      {
        from: IS_FROM_TO[2][0],
        to: IS_FROM_TO[2][1],
        rate: rates[2],
      },
    ];
    return accumulator;
  },
  {
    not_found: [
      {
        from: IS_FROM_TO[0][0],
        to: IS_FROM_TO[0][1],
        rate: IS_DATA.not_found[0],
      },
      {
        from: IS_FROM_TO[1][0],
        to: IS_FROM_TO[1][1],
        rate: IS_DATA.not_found[1],
      },
      {
        from: IS_FROM_TO[2][0],
        to: IS_FROM_TO[2][1],
        rate: IS_DATA.not_found[2],
      },
    ],
  } as IsType,
);
