module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main': "url('/img/main.jpg')",
        'page': "url('/img/page.jpg')",
        'me': "url('/img/7.png')",
      },
    },
    colors: {
      white: '#fff',
      primary: {
        DEFAULT: '#683213',
        dark: '#281E14',
        light: '#9A5E2F',
        lighter: '#DDC9B9',
        hover: '#88471E',
      },
      black: {
        DEFAULT: '#0B1315',
      },
      red: {
        DEFAULT: '#C81E1E',
        light: '#FDF2F2',
      },
      gray: {
        DEFAULT: '#D1D5DB',
        dark: '#9CA3AF',
        light: '#F9FAFB',
        lighter: 'F3F4F6',
        darker: '#6B7280',
        'darker-1': '#374151',
        'darker-2': '#1F2937',
      },
      green: {
        DEFAULT: '#0E9F6E',
        light: '#F3FAF7',
      },
    },
    minHeight: {
      aside: 'calc(100vh - 64px)',
      'aside-sm': 'calc(100vh - 176px)',
      'menu-overflow': 'calc(100vh - 80px)',
    },
    maxHeight: {
      aside: 'calc(100vh - 64px)',
    },
  },
  plugins: [],
}
