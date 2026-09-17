import { NavLink } from 'react-router-dom';
import BrandMark from './BrandMark';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/users', label: 'Users' },
  { to: '/conversations', label: 'Conversations' },
];

function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div className="brand">
          <BrandMark size={26} />
          Chatter Admin
        </div>
        <nav aria-label="Admin sections">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-footer">
          <div>{user?.name}</div>
          <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={logout}>
            Log out
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

export default AdminLayout;
