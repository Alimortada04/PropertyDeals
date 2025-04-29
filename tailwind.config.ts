import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        "breathe": {
          "0%": {
            transform: "scale(1) translate(0px, 0px)",
            opacity: "0.5",
            filter: "blur(calc(var(--blur-amount, 120px) + 5px))",
          },
          "20%": {
            transform: "scale(1.02) translate(8px, -3px)",
            opacity: "0.85",
            filter: "blur(calc(var(--blur-amount, 120px) - 8px))",
          },
          "40%": {
            transform: "scale(1.03) translate(4px, -8px)",
            opacity: "0.95",
            filter: "blur(calc(var(--blur-amount, 120px) + 0px))",
          },
          "60%": {
            transform: "scale(1.025) translate(-6px, -2px)",
            opacity: "0.9",
            filter: "blur(calc(var(--blur-amount, 120px) + 10px))",
          },
          "80%": {
            transform: "scale(1.015) translate(-4px, 5px)",
            opacity: "0.7",
            filter: "blur(calc(var(--blur-amount, 120px) - 5px))",
          },
          "100%": {
            transform: "scale(1) translate(0px, 0px)",
            opacity: "0.5",
            filter: "blur(calc(var(--blur-amount, 120px) + 5px))",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "0.5",
          },
          "50%": {
            opacity: "0.8",
          },
        },
        "ping-slow": {
          "0%": {
            transform: "scale(1)",
            opacity: "1",
          },
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
        "gradient-slow": {
          "0%, 100%": {
            "background-position": "0% 50%",
            "background-size": "200% 200%"
          },
          "50%": {
            "background-position": "100% 50%",
            "background-size": "200% 200%"
          },
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 5s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "breathe": "breathe 8s ease-in-out infinite",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-slow": "gradient-slow 20s ease infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
