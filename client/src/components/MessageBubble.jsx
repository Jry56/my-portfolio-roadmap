import { format } from 'date-fns';

function statusLabel(status) {
  if (status === 'read') return 'Read';
  if (status === 'delivered') return 'Delivered';
  return 'Sent';
}

function MessageBubble({ message, isMine }) {
  return (
    <div className={`message-row ${isMine ? 'mine' : ''}`}>
      <div className="message-bubble">
        <span>{message.text}</span>
        <span className="message-meta">
          {format(new Date(message.createdAt), 'h:mm a')}
          {isMine ? ` · ${statusLabel(message.status)}` : ''}
        </span>
      </div>
    </div>
  );
}

export default MessageBubble;
