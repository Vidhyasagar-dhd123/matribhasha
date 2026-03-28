/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        /* Core surfaces */
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',

        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))',
        },

        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))',
        },

        /* Actions */
        primary: {
          DEFAULT: 'oklch(var(--primary))',
          foreground: 'oklch(var(--primary-foreground))',
        },

        secondary: {
          DEFAULT: 'oklch(var(--secondary))',
          foreground: 'oklch(var(--secondary-foreground))',
        },

        accent: {
          DEFAULT: 'oklch(var(--accent))',
          foreground: 'oklch(var(--accent-foreground))',
        },

        destructive: {
          DEFAULT: 'oklch(var(--destructive))',
          foreground: 'oklch(var(--destructive-foreground))',
        },

        /* Utility */
        muted: {
          DEFAULT: 'oklch(var(--muted))',
          foreground: 'oklch(var(--muted-foreground))',
        },

        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',

        /* Charts */
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))',
        },

        /* Sidebar */
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',

          primary: {
            DEFAULT: 'oklch(var(--sidebar-primary))',
            foreground: 'oklch(var(--sidebar-primary-foreground))',
          },

          accent: {
            DEFAULT: 'oklch(var(--sidebar-accent))',
            foreground: 'oklch(var(--sidebar-accent-foreground))',
          },

          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))',
        },
      },

      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },

      boxShadow: {
        sm: '0 1px 2px oklch(0 0 0 / 0.08)',
        md: '0 4px 12px oklch(0 0 0 / 0.12)',
        lg: '0 10px 30px oklch(0 0 0 / 0.18)',
      },

      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}
