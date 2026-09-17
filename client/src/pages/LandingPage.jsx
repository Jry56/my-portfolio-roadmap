import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Seo from '../seo/Seo';
import BrandMark from '../components/BrandMark';
import '../styles/landing.css';

const FEATURES = [
  {
    title: 'Delivered instantly',
    body: 'Messages travel over a live socket connection, so there is no refresh-and-wait. Your contact sees it the moment you hit send.',
  },
  {
    title: 'Know who is around',
    body: 'Online status and last-seen timestamps update in real time, so you know whether to expect a quick reply.',
  },
  {
    title: 'Typing indicators',
    body: 'See when someone is mid-reply, and let them see the same for you. No more sending three messages before their answer lands.',
  },
];

// Fill in your organization's real details before publishing. LocalBusiness
// schema is only appropriate if the company behind this app has a real
// physical address people can visit or contact — remove this block entirely
// if Chatter is only ever offered as a pure web service.
const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Your Company Name',
  url: 'https://chat.example.com',
  email: 'hello@chat.example.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Street address',
    addressLocality: 'City',
    addressRegion: 'Region',
    addressCountry: 'Country',
  },
};

function LandingPage() {
  return (
    <div className="container">
      <Seo
        title="Real-time messaging for people who hate waiting"
        description="Chatter is a fast, real-time messaging app. Sign up free, message friends instantly, and see who's online."
        path="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_SCHEMA)}</script>
      </Helmet>

      <nav className="landing-nav" aria-label="Main">
        <Link to="/" className="brand">
          <BrandMark size={30} />
          Chatter
        </Link>
        <div className="links">
          <Link to="/login" className="btn btn-ghost">
            Sign in
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get started free
          </Link>
        </div>
      </nav>

      <header className="landing-hero">
        <div>
          <h1>Real-time messaging for people who hate waiting.</h1>
          <p className="lede">
            Chatter delivers messages the instant you send them, shows you who&rsquo;s online, and
            tells you when someone&rsquo;s typing back. No delays, no guessing.
          </p>
          <div className="cta-row">
            <Link to="/register" className="btn btn-primary">
              Create free account
            </Link>
            <Link to="/login" className="btn btn-ghost">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="hero-mock" role="img" aria-label="Preview of a Chatter conversation between two people">
          <div className="mock-row">
            <div className="bubble them">Are you still on for the call at 4?</div>
          </div>
          <div className="mock-row">
            <div className="bubble me">Yep, joining now</div>
          </div>
          <div className="mock-row">
            <div className="bubble them">Perfect, see you there</div>
          </div>
        </div>
      </header>

      <section className="landing-features" aria-labelledby="features-heading">
        <h2 id="features-heading">Built around three things people actually want from chat.</h2>
        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Chatter. All rights reserved.</span>
        <span>
          <a href="mailto:hello@chat.example.com">hello@chat.example.com</a>
        </span>
      </footer>
    </div>
  );
}

export default LandingPage;
