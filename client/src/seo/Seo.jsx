import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Chatter';
// Replace with your real production domain before deploying.
const SITE_URL = 'https://chat.example.com';

/**
 * Drops a unique title, meta description and canonical tag onto whichever
 * page renders it. Pass `path` as the route (e.g. "/login") so the
 * canonical URL is correct; pass `structuredData` for page-specific JSON-LD
 * (e.g. BreadcrumbList) in addition to the site-wide Organization schema
 * already declared in index.html.
 */
function Seo({ title, description, path = '/', structuredData, noindex = false }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
    </Helmet>
  );
}

export default Seo;
