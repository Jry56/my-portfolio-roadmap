import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import StatCard from '../components/StatCard';
import Seo from '../seo/Seo';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Could not load dashboard stats.'));
  }, []);

  return (
    <AdminLayout>
      <Seo title="Dashboard" />
      <div className="admin-topbar">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />
        <h1>Dashboard</h1>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {!stats && !error && <p>Loading stats…</p>}

      {stats && (
        <div className="stat-grid">
          <StatCard label="Total users" value={stats.totalUsers.toLocaleString()} />
          <StatCard label="Online right now" value={stats.onlineUsers.toLocaleString()} />
          <StatCard label="Total conversations" value={stats.totalConversations.toLocaleString()} />
          <StatCard label="Total messages" value={stats.totalMessages.toLocaleString()} />
          <StatCard label="Messages (24h)" value={stats.messagesToday.toLocaleString()} />
          <StatCard label="New users (24h)" value={stats.newUsersToday.toLocaleString()} />
        </div>
      )}
    </AdminLayout>
  );
}

export default DashboardPage;
