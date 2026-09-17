import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import BrandMark from '../components/BrandMark';
import '../styles/notfound.css';

function NotFoundPage() {
  return (
    <div className="notfound-screen">
      <Seo
        title="Page not found"
        description="The page you're looking for doesn't exist or may have moved."
        path="/404"
        noindex
      />
      <BrandMark size={56} title="Chatter" />
      <h1>This page went offline.</h1>
      <p>
        The link you followed doesn&rsquo;t match anything here. It may have been moved, or the
        address might have a typo.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;
