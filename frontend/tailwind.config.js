/**
 * Tailwind CSS configuration file
 */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  darkMode: 'class', // enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // custom colors matching the design
        limeTheme: '#a3e635',
        darkBg: '#0b0c0f',
        glassWhite: 'rgba(255, 255, 255, 0.02)',
        glassBorder: 'rgba(255, 255, 255, 0.06)'
      },
      borderRadius: {
        '28': '28px'
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
};
