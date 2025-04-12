import type { Config } from "tailwindcss";

const config = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",

      smartphone: "480px",
      // => @media (min-width: 480px) { ... }
      tablet: "640px",
      // => @media (min-width: 640px) { ... }
      ipad: "768px",
      // => @media (min-width: 640px) { ... }
      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      desktop: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
  },
} satisfies Config;

export default config;
