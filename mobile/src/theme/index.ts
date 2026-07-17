export const colors = {
  primary: '#0085FF',
  text: '#0B0F14',
  textMuted: '#42576C',
  textFaint: '#788EA5',
  bg: '#FFFFFF',
  bgAlt: '#F1F3F5',
  border: '#E4E8EB',
  danger: '#EC4899',
};

export const typography = {
  display: { fontSize: 20, fontWeight: '700' as const },
  handle: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 15, lineHeight: 22 },
  meta: { fontSize: 13 },
  action: { fontSize: 15, fontWeight: '600' as const },
};

export const radius = {
  sm: 8,
  md: 12,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const theme = {
  colors,
  typography,
  radius,
  spacing,
};

export default theme;
