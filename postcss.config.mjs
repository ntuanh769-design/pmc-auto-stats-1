/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- Đã sửa dòng này (thêm @ và /postcss)
    autoprefixer: {},
  },
};

export default config;