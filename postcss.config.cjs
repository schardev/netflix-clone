module.exports = {
  plugins: [
    require("css-modular-type")({
      insertMinMaxFontAsVariables: true,
    }),
    require("autoprefixer"),
  ],
};
