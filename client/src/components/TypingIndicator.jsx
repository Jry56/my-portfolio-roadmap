function TypingIndicator({ name }) {
  return (
    <p className="typing-indicator" aria-live="polite">
      {name} is typing…
    </p>
  );
}

export default TypingIndicator;
