import type { ISitemapField, IConfig } from 'next-sitemap'

/**
 * Next Sitemap configuration
 * @see https://github.com/iamvishnusankar/next-sitemap#configuration-options
 */
const config: IConfig = {
  siteUrl: process.env.SITE_URL || 'https://tuovila.com',
  generateRobotsTxt: true,
  outDir: 'public',
  
  // Optional: exclude paths you don't want in the sitemap
  exclude: ['/admin', '/private/*', '/api/*'],
  
  // Optional: Custom transformations for each URL
  transform: async (config, path): Promise<ISitemapField> => {
    // Custom logic for specific paths
    // Example: lower priority for certain paths
    if (path.includes('/blog')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default transformation
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
  
  // Optional: Additional robots.txt rules
  robotsTxtOptions: {
    additionalSitemaps: [
      // If you have additional sitemaps, add them here
      // 'https://yourwebsite.com/other-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/private'],
      },
    ],
  },
}

export default config