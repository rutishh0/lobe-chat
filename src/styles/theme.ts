import { ThemeAppearance } from 'antd-style';
import { NeutralColors, PrimaryColors } from '@lobehub/ui';

export const ELEVATE_THEME = {
  // Primary color from your website
  primaryColor: '#7C3AED' as PrimaryColors,
  
  // Dark theme colors
  token: {
    colorBgLayout: '#000000',
    colorBgContainer: '#111111',
    colorBgElevated: '#1A1A1A',
    
    // Text colors
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255, 255, 255, 0.75)',
    
    // Border colors
    colorBorder: 'rgba(255, 255, 255, 0.15)',
    
    // Button styles
    controlHeight: 40,
    borderRadius: 8,
    
    // Font settings
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  },
  
  // Custom CSS variables for gradients
  cssVar: {
    'gradient-blue': 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
    'gradient-purple': 'linear-gradient(90deg, #7C3AED 0%, #6D28D9 100%)',
  },
};

// Default appearance is dark mode
export const defaultAppearance: ThemeAppearance = 'dark';

// Neutral colors for dark theme
export const defaultNeutralColor: NeutralColors = 'slate';
