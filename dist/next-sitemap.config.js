var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Next Sitemap configuration
 * @see https://github.com/iamvishnusankar/next-sitemap#configuration-options
 */
const config = {
    siteUrl: process.env.SITE_URL || 'https://tuovila.com',
    generateRobotsTxt: true,
    outDir: 'public',
    // Optional: exclude paths you don't want in the sitemap
    exclude: ['/admin', '/private/*', '/api/*'],
    // Optional: Custom transformations for each URL
    transform: (config, path) => __awaiter(void 0, void 0, void 0, function* () {
        // Custom logic for specific paths
        // Example: lower priority for certain paths
        if (path.includes('/blog')) {
            return {
                loc: path,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            };
        }
        // Default transformation
        return {
            loc: path,
            changefreq: 'daily',
            priority: 0.7,
            lastmod: new Date().toISOString(),
        };
    }),
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
};
export default config;
