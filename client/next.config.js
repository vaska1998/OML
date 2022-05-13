/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer(nextTranslate({
  reactStrictMode: true,
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
