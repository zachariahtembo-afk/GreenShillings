export const designTokens = {
  typography: {
    fontSans: 'General Sans',
    fontDisplay: 'Clash Display',
    sizes: {
      displayXL: '4.5rem',
      displayLG: '3.75rem',
      displayMD: '3rem',
      displaySM: '2.25rem',
      bodyLG: '1.125rem',
      bodyMD: '1rem',
      bodySM: '0.875rem',
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4.5rem',
  },
  radii: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    pill: '999px',
  },
  shadows: {
    soft: '0 10px 30px rgba(10, 28, 20, 0.08)',
    lift: '0 20px 50px rgba(10, 28, 20, 0.14)',
  },
  palettes: {
    optionA: {
      name: 'Forest + Gold',
      description: 'Deep forest green with warm gold accent on a white base.',
      colors: {
        base: '#FFFFFF',
        chalk: '#F8F5EF',
        forest: '#0B2F1E',
        accent: '#F2B84B',
        charcoal: '#121612',
        ink: '#0E1110',
      },
    },
    optionB: {
      name: 'Forest + Lime',
      description: 'Deep forest green with bright lime accent on a white base.',
      colors: {
        base: '#FFFFFF',
        chalk: '#F9F7F2',
        forest: '#0B2F1E',
        accent: '#2DE070',
        charcoal: '#121612',
        ink: '#0E1110',
      },
    },
  },
} as const;

export type PaletteOption = keyof typeof designTokens.palettes;
