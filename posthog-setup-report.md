# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into tuovila.com. The setup covers client-side initialization via `instrumentation-client.ts` (Next.js 15.3+ pattern), a reverse proxy in `next.config.ts` to route PostHog traffic through `/ingest`, error tracking in the global error boundary, and event capture across all key pages. No providers or wrappers were added — PostHog initializes through Next.js's native instrumentation hook.

| Event Name | Description | File |
|---|---|---|
| `social_link_clicked` | User clicks a social media link (LinkedIn, GitHub, SoundCloud, Last.FM, or Hardcover) from the home page | `src/app/page.tsx` |
| `social_link_clicked` | User clicks a social media link from the about page | `src/app/about/page.tsx` |
| `dark_mode_toggled` | User toggles between dark and light mode | `src/components/NavBar.tsx` |
| `mobile_menu_opened` | User opens the mobile hamburger navigation menu | `src/components/NavBar.tsx` |
| `blog_post_clicked` | User clicks a blog post card from the blog listing page | `src/app/blog/page.tsx` |
| `blog_post_viewed` | A blog post loads successfully and is displayed to the user | `src/app/blog/[slug]/page.tsx` |
| `blog_error_retry_clicked` | User clicks the retry button after a blog post fails to load | `src/app/blog/[slug]/page.tsx` |
| `book_clicked` | User clicks a book cover on the reads page to view it on Hardcover | `src/app/reads/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483922/dashboard/1760547)
- [Social link clicks by platform (30d)](https://us.posthog.com/project/483922/insights/zu0uCAZn)
- [Blog post views over time (30d)](https://us.posthog.com/project/483922/insights/pQmFPnz5)
- [Blog post clicks from listing (30d)](https://us.posthog.com/project/483922/insights/esAAMnOR)
- [Book clicks on reads page (30d)](https://us.posthog.com/project/483922/insights/pyGbdQys)
- [Dark mode toggle count (30d)](https://us.posthog.com/project/483922/insights/NfwP26lN)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
