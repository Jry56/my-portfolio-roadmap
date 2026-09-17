import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import Seo from '../seo/Seo';
import '../styles/chat.css';

function ChatPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUserId, setTypingUserId] = useState(null);
  const typingTimeoutRef = useRef(null);

  const activeConversation = conversations.find((c) => c._id === conversationId) || null;
  const otherPerson = activeConversation?.participants.find((p) => p.id !== user.id && p._id !== user.id);

  const loadConversations = useCallback(async () => {
    const { data } = await api.get('/conversations');
    setConversations(data.conversations);
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load message history whenever the selected conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    api.get(`/conversations/${conversationId}/messages`).then(({ data }) => setMessages(data.messages));
    socket?.emit('conversation:join', conversationId);

    return () => socket?.emit('conversation:leave', conversationId);
  }, [conversationId, socket]);

  // Global socket listeners: live messages, conversation list updates, presence
  useEffect(() => {
    if (!socket) return undefined;

    function handleNewMessage({ message }) {
      if (message.conversation === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    }

    function handleConversationUpdated() {
      loadConversations();
    }

    function handlePresence({ userId, isOnline, lastSeen }) {
      setConversations((prev) =>
        prev.map((conversation) => ({
          ...conversation,
          participants: conversation.participants.map((p) =>
            p.id === userId || p._id === userId ? { ...p, isOnline, lastSeen } : p
          ),
        }))
      );
    }

    function handleTyping({ conversationId: convoId, userId, isTyping }) {
      if (convoId !== conversationId) return;
      setTypingUserId(isTyping ? userId : null);
    }

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:updated', handleConversationUpdated);
    socket.on('presence:update', handlePresence);
    socket.on('typing:update', handleTyping);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:updated', handleConversationUpdated);
      socket.off('presence:update', handlePresence);
      socket.off('typing:update', handleTyping);
    };
  }, [socket, conversationId, loadConversations]);

  async function handleStartConversation(userId) {
    const { data } = await api.post('/conversations', { userId });
    await loadConversations();
    navigate(`/app/${data.conversation._id}`);
  }

  function handleSend(text) {
    if (!socket || !conversationId) return;
    socket.emit('message:send', { conversationId, text }, (ack) => {
      if (!ack?.ok) {
        // The composer already cleared optimistically; a failed send is rare
        // (dropped connection) so we just log it rather than block the UI.
        console.error('Message failed to send:', ack?.error);
      }
    });
  }

  function handleTyping(isTyping) {
    if (!socket || !conversationId) return;
    clearTimeout(typingTimeoutRef.current);
    socket.emit(isTyping ? 'typing:start' : 'typing:stop', { conversationId });
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing:stop', { conversationId });
      }, 2500);
    }
  }

  const typingPersonName =
    typingUserId && activeConversation?.participants.find((p) => p.id === typingUserId || p._id === typingUserId)?.name;

  return (
    <div className={`chat-shell ${conversationId ? 'conversation-open' : ''}`}>
      <Seo title="Your conversations" path="/app" noindex />
      <Sidebar
        conversations={conversations}
        activeConversationId={conversationId}
        onSelectConversation={(id) => navigate(`/app/${id}`)}
        onStartConversation={handleStartConversation}
      />
      <ChatWindow
        conversation={activeConversation}
        otherPerson={otherPerson}
        messages={messages}
        currentUserId={user.id}
        typingName={typingPersonName}
        onSend={handleSend}
        onTyping={handleTyping}
      />
    </div>
  );
}

export default ChatPage;
