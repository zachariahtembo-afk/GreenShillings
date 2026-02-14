import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Clash Display', 'General Sans', 'serif'],
        sans: ['General Sans', 'sans-serif'],
        display: ['Clash Display', 'General Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'display-2xl': [
          '4.5rem',
          {
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            fontWeight: '500',
          },
        ],
        'display-xl': [
          '3.75rem',
          {
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            fontWeight: '500',
          },
        ],
        'display-lg': [
          '3rem',
          {
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            fontWeight: '500',
          },
        ],
        'display-md': [
          '2.25rem',
          {
            lineHeight: '1.2',
            letterSpacing: '-0.01em',
            fontWeight: '500',
          },
        ],
        'display-sm': [
          '1.875rem',
          {
            lineHeight: '1.25',
            letterSpacing: '-0.01em',
            fontWeight: '500',
          },
        ],
        'body-xl': [
          '1.25rem',
          {
            lineHeight: '1.7',
          },
        ],
        'body-lg': [
          '1.125rem',
          {
            lineHeight: '1.7',
          },
        ],
        'body-md': [
          '1rem',
          {
            lineHeight: '1.7',
          },
        ],
        'body-sm': [
          '0.875rem',
          {
            lineHeight: '1.6',
          },
        ],
        'body-xs': [
          '0.75rem',
          {
            lineHeight: '1.5',
          },
        ],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        section: '7.5rem',
        'section-lg': '120px',
      },
      colors: {
        green: {
          DEFAULT: '#1B7A3D',
          light: '#2E9E55',
          dark: '#145C2E',
          tint: '#E8F5ED',
        },
        charcoal: '#111412',
        chalk: '#F9F7F2',
        white: '#FFFFFF',

        // shadcn/ui + legacy compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        forest: '#1B7A3D',
        leaf: '#F2B84B',
      },
      borderRadius: {
        none: '0',
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: '0.375rem',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 2px rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
        lg: '0 4px 12px rgba(0, 0, 0, 0.04)',
        xl: '0 8px 24px rgba(0, 0, 0, 0.06)',
        '2xl': '0 16px 48px rgba(0, 0, 0, 0.08)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.03)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideInLeft: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      maxWidth: {
        content: '72rem',
        prose: '65ch',
        narrow: '36rem',
      },
    },
  },
  plugins: [forms, typography, animate],
};

export default config;
