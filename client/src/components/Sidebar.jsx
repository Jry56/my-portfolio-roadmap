import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import api from '../api/axios';
import Avatar from './Avatar';
import BrandMark from './BrandMark';
import { useAuth } from '../context/AuthContext';

function otherParticipant(conversation, currentUserId) {
  return conversation.participants.find((p) => p.id !== currentUserId && p._id !== currentUserId) || {};
}

function Sidebar({ conversations, activeConversationId, onSelectConversation, onStartConversation }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return undefined;
    }

    setSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const { data } = await api.get('/users', { params: { search: query.trim() } });
        setResults(data.users);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  const isSearchMode = query.trim().length > 0;

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <BrandMark size={26} />
          Chatter
        </div>
      </div>

      <div className="sidebar-search">
        <label htmlFor="user-search" className="visually-hidden">
          Search people
        </label>
        <input
          id="user-search"
          type="search"
          placeholder="Search people to message"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {isSearchMode ? (
        <ul className="sidebar-list" aria-label="Search results">
          {searching && <li className="sidebar-empty">Searching…</li>}
          {!searching && results.length === 0 && (
            <li className="sidebar-empty">No one matches “{query}”.</li>
          )}
          {results.map((person) => (
            <li key={person.id}>
              <button
                type="button"
                className="contact-item"
                onClick={() => {
                  onStartConversation(person.id);
                  setQuery('');
                }}
              >
                <Avatar name={person.name} seed={person.email} size={44} online={person.isOnline} />
                <div className="conversation-meta">
                  <div className="name">{person.name}</div>
                  <div className="preview">{person.about}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="sidebar-list" aria-label="Your conversations">
          {conversations.length === 0 && (
            <li className="sidebar-empty">
              No conversations yet. Search for someone above to say hello.
            </li>
          )}
          {conversations.map((conversation) => {
            const other = otherParticipant(conversation, user.id);
            const isActive = conversation._id === activeConversationId;
            return (
              <li key={conversation._id}>
                <button
                  type="button"
                  className={`conversation-item ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectConversation(conversation._id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <Avatar name={other.name} seed={other.email} size={48} online={other.isOnline} />
                  <div className="conversation-meta">
                    <div className="top-row">
                      <span className="name">{other.name || 'Unknown user'}</span>
                      {conversation.lastMessageAt && (
                        <span className="time">
                          {formatDistanceToNowStrict(new Date(conversation.lastMessageAt), {
                            addSuffix: false,
                          })}
                        </span>
                      )}
                    </div>
                    <div className="preview">
                      {conversation.lastMessage?.text || 'Say hello 👋'}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="sidebar-footer">
        <Avatar name={user.name} seed={user.email} size={38} />
        <div className="who">
          <div className="name">{user.name}</div>
          <div className="about">{user.about}</div>
        </div>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
