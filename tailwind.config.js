module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'sm': {'min': '0px', 'max': '1023px'},
      'lg': '1024px',
    },
    extend: {},
    fontFamily: {
      body: ['Vollkorn']
    },
    fontSize: {
      h1: ['50px', '60px'],
      h2: ['20px', '20px'],
      body: ['16px', '23px']
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    container: false,
  }
}
