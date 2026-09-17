import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import Avatar from '../components/Avatar';
import Seo from '../seo/Seo';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      api
        .get('/admin/users', { params: { search, page } })
        .then(({ data }) => {
          setUsers(data.users);
          setPages(data.pages);
          setError('');
        })
        .catch(() => setError('Could not load users.'))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, page]);

  async function toggleStatus(user) {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const { data } = await api.patch(`/admin/users/${user.id}/status`, { status: nextStatus });
    setUsers((prev) => prev.map((u) => (u.id === user.id ? data.user : u)));
  }

  async function removeUser(user) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    await api.delete(`/admin/users/${user.id}`);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
  }

  return (
    <AdminLayout>
      <Seo title="Users" />
      <div className="admin-topbar">
        <Breadcrumbs items={[{ label: 'Dashboard', path: '/' }, { label: 'Users' }]} />
        <h1>Users</h1>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <label htmlFor="user-search" className="visually-hidden">
            Search users
          </label>
          <input
            id="user-search"
            type="search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Joined</th>
              <th scope="col">
                <span className="visually-hidden">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="empty-row">
                <td colSpan={5}>Loading users…</td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr className="empty-row">
                <td colSpan={5}>No users match your search.</td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr key={user.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={user.name} seed={user.email} size={32} />
                    {user.name}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-suspended'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleStatus(user)}>
                        {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeUser(user)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UsersPage;
