import { useEffect, useState } from 'react';
import api from '../api/axios';
import AdminLayout from '../components/AdminLayout';
import Breadcrumbs from '../components/Breadcrumbs';
import Avatar from '../components/Avatar';
import Seo from '../seo/Seo';

function ConversationsPage() {
  const [conversations, setConversations] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get('/admin/conversations', { params: { page } })
      .then(({ data }) => {
        setConversations(data.conversations);
        setPages(data.pages);
        setError('');
      })
      .catch(() => setError('Could not load conversations.'))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <AdminLayout>
      <Seo title="Conversations" />
      <div className="admin-topbar">
        <Breadcrumbs items={[{ label: 'Dashboard', path: '/' }, { label: 'Conversations' }]} />
        <h1>Conversations</h1>
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="panel">
        <table>
          <thead>
            <tr>
              <th scope="col">Participants</th>
              <th scope="col">Last message</th>
              <th scope="col">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="empty-row">
                <td colSpan={3}>Loading conversations…</td>
              </tr>
            )}
            {!loading && conversations.length === 0 && (
              <tr className="empty-row">
                <td colSpan={3}>No conversations yet.</td>
              </tr>
            )}
            {!loading &&
              conversations.map((conversation) => (
                <tr key={conversation._id}>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {conversation.participants.map((p) => (
                        <span key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Avatar name={p.name} seed={p.email} size={26} />
                          {p.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{conversation.lastMessage?.text || '—'}</td>
                  <td>{new Date(conversation.lastMessageAt).toLocaleString()}</td>
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

export default ConversationsPage;
