import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';
import Seo from '../seo/Seo';

function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        textAlign: 'center',
        padding: 24,
      }}
    >
      <Seo title="Page not found" />
      <BrandMark size={48} title="Chatter Admin" />
      <h1>Page not found</h1>
      <p style={{ color: 'var(--slate)', maxWidth: '32ch' }}>
        That admin page doesn&rsquo;t exist. Double-check the link or go back to the dashboard.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
