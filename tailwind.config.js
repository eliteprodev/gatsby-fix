const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      brown: {
        DEFAULT: '#413529',
        light: '#E3E1D6',
        medium: '#8B8378',
      },
      gray: colors.gray,
      white: colors.white,
      blue: {
        ...colors.blue,
        light: '#72DAED',
        dark: '#0C2539',
        'very-dark': '#0C1419',
      },
      green: {
        ...colors.green,
        DEFAULT: '#66D866',
      },
      red: {
        ...colors.red,
        DEFAULT: '#C1272D',
      },
      yellow: {
        DEFAULT: '#FFA515',
      },
    },
    fontFamily: {
      body: ['iowan-old-style', ...defaultTheme.fontFamily.sans],
      header: ['whiskey-font-one', ...defaultTheme.fontFamily.serif],
    },
    extend: {
      fontSize: {
        '9xl': [defaultTheme.fontSize['9xl'][0], '0.85'],
      },
      screens: {
        '4k': '2560px',
      },
      spacing: {
        18: '4.5rem',
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.600'),
            a: {
              color: theme('colors.blue.600'),
            },
            strong: {
              color: 'inherit',
            },
            hr: {
              marginTop: '2.25em',
              marginBottom: '2.25em',
            },
            'ul > li::before': {
              backgroundColor: 'currentColor',
            },
            h1: {
              color: theme('colors.gray.700'),
            },
            h2: {
              color: theme('colors.gray.700'),
            },
            h3: {
              color: theme('colors.gray.700'),
            },
            h4: {
              color: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
