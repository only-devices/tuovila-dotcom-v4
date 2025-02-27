// This file is needed because next-sitemap expects a CommonJS or ESM module file
// It simply re-exports the TypeScript config after it's been processed

import config from './dist/next-sitemap.config.js'

export default config