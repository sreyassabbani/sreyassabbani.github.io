/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.res',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [
    '@tailwindcss/typography'
  ]
}
