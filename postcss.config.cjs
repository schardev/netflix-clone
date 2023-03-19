module.exports = {
  plugins: [
    require("postcss-modular-type")({
      insertMinMaxFontAsVariables: true,
    }),
    require("autoprefixer"),
  ],
};
