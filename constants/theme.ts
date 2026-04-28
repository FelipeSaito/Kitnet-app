export const Colors = {
  bg: '#0a0a0a',
  surface: '#141410',
  card: '#1A1A15',
  card2: '#241F15',
  gold: '#FFC928',
  gold2: '#F4BF1B',
  text: '#EBE1D1',
  text2: '#D2C5AC',
  text3: '#9B8F79',
  inputBg: '#2A2A24',
  border: '#2E291F',
  border2: '#4E4633',
  green: '#4CAF50',
  red: '#E53935',
  orange: '#FF8C00',
  blue: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Spacing = {
  containerPadding: 20,
  gridGutter: 12,
  stackSm: 8,
  stackMd: 16,
  stackLg: 24,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  displayCasas: {
    fontFamily: 'NotoSerif_700Bold',
    fontSize: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: Colors.gold,
  },
  h1: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  h2: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bodyLg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  bodySm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.text2,
  },
  labelCaps: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    color: Colors.text3,
  },
};
