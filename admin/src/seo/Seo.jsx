import { Helmet } from 'react-helmet-async';

/**
 * Every admin page still gets a unique, correct <title> and noindex
 * directive - this is an internal tool, not something search engines
 * should ever surface, but the tab title should still say where you are.
 */
function Seo({ title }) {
  const fullTitle = title ? `${title} — Chatter Admin` : 'Chatter Admin';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}

export default Seo;
