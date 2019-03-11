import Typography from "typography"

const typography = new Typography({
  baseFontSize: "16px",
  baseLineHeight: 1.375,
  headerFontFamily: [
    'Gafata',
    'serif'
  ],
  bodyFontFamily: [
    'Roboto Slab',
    'sans-serif'
  ]
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
