import { ThemeAppearance } from 'antd-style';
import { NeutralColors, PrimaryColors } from '@lobehub/ui';

// Elevate theme configuration
export const ELEVATE_THEME = {
  appearance: 'dark' as ThemeAppearance,
  primaryColor: '#7C3AED' as PrimaryColors,
  neutralColor: 'slate' as NeutralColors,
  tokens: {
    colorBgLayout: '#000000',
    colorBgContainer: '#111111',
    colorBgElevated: '#1A1A1A',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255, 255, 255, 0.75)',
    colorBorder: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    controlHeight: 40,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  gradients: {
    blue: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
    purple: 'linear-gradient(90deg, #7C3AED 0%, #6D28D9 100%)',
  },
};

// Update default variants to use Elevate theme
export const DEFAULT_THEME_VARIANTS = {
  theme: ELEVATE_THEME.appearance,
  primaryColor: ELEVATE_THEME.primaryColor,
  neutralColor: ELEVATE_THEME.neutralColor,
};
