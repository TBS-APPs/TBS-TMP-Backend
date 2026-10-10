export const SEED_PALETTES: Array<{
  code: string;
  label: string;
  isDefault: boolean;
  sortOrder: number;
  primary: string;
  secondary: string;
  tertiary: string;
}> = [
  {
    code: 'olive',
    label: 'Olive',
    isDefault: true,
    sortOrder: 0,
    primary: '#556B2F',
    secondary: '#eba20e',
    tertiary: '#7BC3FA',
  },
  {
    code: 'navy',
    label: 'Navy',
    isDefault: false,
    sortOrder: 1,
    primary: '#00599C',
    secondary: '#2259BF',
    tertiary: '#DAE9F8',
  },
  {
    code: 'metallicGold',
    label: 'Metallic Gold',
    isDefault: false,
    sortOrder: 2,
    primary: '#D4AF37',
    secondary: '#8B1E3F',
    tertiary: '#F9F3E1',
  },
  {
    code: 'blueSpruce',
    label: 'Blue Spruce',
    isDefault: false,
    sortOrder: 3,
    primary: '#00796B',
    secondary: '#FF7043',
    tertiary: '#D9EBE9',
  },
  {
    code: 'pacificBlue',
    label: 'Pacific Blue',
    isDefault: false,
    sortOrder: 4,
    primary: '#00ACC1',
    secondary: '#6A1B9A',
    tertiary: '#D9F3F6',
  },
];
