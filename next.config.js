/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(nextTranslate({
  reactStrictMode: true,
  server: {
    host: '0.0.0.0',
    port: '3000',
  },
  eslint: {
    dirs: ['src/pages', 'src/infrastructure', 'src/store', 'src/components'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts)$/,
      loader: 'ts-loader',
      options: { allowTsInNodeModules: true }
    });
    return config;
  }
}));
