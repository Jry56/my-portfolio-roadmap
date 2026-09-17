import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/breadcrumbs.css';

// Internal tool, but structured data costs nothing to include correctly.
const SITE_URL = 'https://admin.chat.example.com';

function Breadcrumbs({ items }) {
  if (!items || items.length < 2) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${SITE_URL}${item.path}` : undefined,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.label}>
              {index > 0 && <span className="sep" aria-hidden="true">/</span>}{' '}
              {isLast || !item.path ? (
                <span className="current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link to={item.path}>{item.label}</Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export default Breadcrumbs;
