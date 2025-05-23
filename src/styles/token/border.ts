import { colors } from './colors';

export const border = {
  widthValue: 1,
  width: '1px',
  style: 'solid',
  color: colors.semantic.border.light,
  default: `1px solid ${colors.semantic.border.light}`,
  radius: {
    xs: '4px',
    sm: '8px',
    lg: '32px',
    values: {
      xs: 4,
      lg: 32,
    },
  },
};
