const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./mdx-components.tsx",
    "content/**/*.mdx",
  ],

  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
        quoteless: {
          css: {
            "blockquote p:first-of-type::before": { content: "none" },
            "blockquote p:first-of-type::after": { content: "none" },
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-calsans)"],
      },
      backgroundImage: {
        "gradient-radial":
          "radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fade-in 3s ease-in-out forwards",
        "letter-in": "letter-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shine: "shine 7s ease-in-out 2.4s infinite",
        nebula: "nebula 22s ease-in-out infinite alternate",
        "fade-in-fast": "fade-in-fast 2.5s ease-out forwards",
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-left": "fade-left 3s ease-in-out forwards",
        "fade-right": "fade-right 3s ease-in-out forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0%",
          },
          "75%": {
            opacity: "0%",
          },
          "100%": {
            opacity: "100%",
          },
        },
        "fade-left": {
          "0%": {
            transform: "translateX(100%)",
            opacity: "0%",
          },

          "30%": {
            transform: "translateX(0%)",
            opacity: "100%",
          },
          "100%": {
            opacity: "0%",
          },
        },
        "fade-right": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0%",
          },

          "30%": {
            transform: "translateX(0%)",
            opacity: "100%",
          },
          "100%": {
            opacity: "0%",
          },
        },
        "letter-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(0.35em) scale(0.9)",
            filter: "blur(12px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0)",
          },
        },
        nebula: {
          "0%": {
            transform: "translate(0, 0) scale(1)",
          },
          "50%": {
            transform: "translate(6%, -4%) scale(1.15)",
          },
          "100%": {
            transform: "translate(-4%, 5%) scale(0.95)",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in-fast": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        shine: {
          "0%": {
            "background-position": "150% 0",
          },
          "35%, 100%": {
            "background-position": "-50% 0",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-debug-screens"),
  ],
};
