/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.html', './src/**/*.js', './build.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      colors: {
        ink:  { 950:'#000000', 900:'#07070A', 800:'#0C0C11', 700:'#13131A', 600:'#1C1C26', 500:'#2A2A38' },
        plum: { 700:'#5B21B6', 600:'#6D28D9', 500:'#8B5CF6', 400:'#A78BFA', 300:'#C4B5FD', 200:'#DDD6FE' }
      },
      maxWidth: { shell: '1320px' }
    }
  },
  plugins: []
};
