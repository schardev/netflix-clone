module.exports = {
  plugins: [
    require('postcss-modular-type')({
      prefix: 'step-'
    }),
    require("autoprefixer")
  ],
};
