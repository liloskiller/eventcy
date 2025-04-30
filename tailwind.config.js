/** @type {import('tailwindcss').Config} */
module.exports = { 
  darkMode: 'class', // Enables toggling dark mode via class
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#121212', // Main background color
        card: '#1E1E2F', // Card or section background color
        primaryText: '#E0E0E0', // Primary text color
        secondaryText: '#B0B0B0', // Secondary text color
        accent: '#A259FF', // Accent color for headings/buttons
        accentHover: '#B87FFF', // Hover state for accent color
        borderDark: '#2E2E2E', // Dark border color
      },
      borderRadius: {
        xl: '1rem', // Large border radius
        '2xl': '1.5rem', // Extra large border radius
      },
    },
  },
  plugins: [],
}

