import { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyState from './EmptyState';

function statusText(person) {
  if (!person) return '';
  if (person.isOnline) return 'Online';
  if (person.lastSeen) {
    return `Last seen ${new Date(person.lastSeen).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }
  return '';
}

function ChatWindow({ conversation, otherPerson, messages, currentUserId, typingName, onSend, onTyping }) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, typingName]);

  if (!conversation) {
    return (
      <div className="chat-pane">
        <EmptyState
          title="Pick a conversation"
          body="Choose someone from the list, or search for a person to start a new chat."
        />
      </div>
    );
  }

  function handleChange(event) {
    setDraft(event.target.value);
    onTyping(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setDraft('');
    onTyping(false);
  }

  return (
    <div className="chat-pane">
      <header className="chat-pane-header">
        <Avatar name={otherPerson?.name} seed={otherPerson?.email} size={40} online={otherPerson?.isOnline} />
        <div>
          <div className="name">{otherPerson?.name || 'Unknown user'}</div>
          <div className="status">{statusText(otherPerson)}</div>
        </div>
      </header>

      <div className="chat-messages" ref={scrollRef} role="log" aria-live="polite">
        {messages.length === 0 && (
          <p style={{ color: 'var(--slate)', textAlign: 'center', marginTop: 32 }}>
            This is the start of your conversation with {otherPerson?.name}.
          </p>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isMine={message.sender === currentUserId || message.sender?._id === currentUserId}
          />
        ))}
      </div>

      {typingName && <TypingIndicator name={typingName} />}

      <form className="composer" onSubmit={handleSubmit}>
        <label htmlFor="composer-input" className="visually-hidden">
          Write a message
        </label>
        <textarea
          id="composer-input"
          rows={1}
          placeholder="Write a message"
          value={draft}
          onChange={handleChange}
          onBlur={() => onTyping(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />
        <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
