
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatSection } from '@/components/chat/chat-section';
import { Message } from '@/types/messages';

describe('ChatSection', () => {
  const mockMessages: Message[] = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
  ];

  it('should render messages and handle user input', () => {
    const setInput = jest.fn();
    const onSubmit = jest.fn((e) => e.preventDefault());

    render(
      <ChatSection
        messages={mockMessages}
        input="test input"
        setInput={setInput}
        isTyping={false}
        messagesEndRef={{ current: null }}
        onSubmit={onSubmit}
        onReset={() => {}}
      />
    );

    // Check if messages are rendered
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();

    // Check if input is rendered with the correct value
    const inputElement = screen.getByPlaceholderText("Describe what you'd like to create...");
    expect(inputElement).toHaveValue('test input');

    // Simulate user typing
    fireEvent.change(inputElement, { target: { value: 'new input' } });
    expect(setInput).toHaveBeenCalledWith('new input');

    // Simulate form submission
    fireEvent.submit(inputElement);
    expect(onSubmit).toHaveBeenCalled();
  });
});
