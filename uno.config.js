// UnoCSS presets (Tailwind-compatible utilities and typography), as on the home page. The CLI scans the built HTML in _site/ (see "build" in package.json).
import presetWind4 from "@unocss/preset-wind4";
import presetTypography from "@unocss/preset-typography";

export default {
  presets: [presetWind4(), presetTypography()],
};
