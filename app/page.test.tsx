
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '@/app/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock the trpc client
jest.mock('@/trpc/client', () => ({
  trpc: {
    chat: {
      useMutation: jest.fn(),
    },
    saveAsset: {
      useMutation: jest.fn(),
    },
  },
}));

import { trpc } from '@/trpc/client';

const queryClient = new QueryClient();



describe('ChatPage Integration Test', () => {
  beforeEach(() => {
    const mockChatMutation = jest.fn().mockResolvedValue({
      message: { role: 'assistant', content: 'This is a mock response' },
      assets: [],
      conversationId: 'conv123',
    });

    const mockSaveAssetMutation = jest.fn().mockResolvedValue({});

    (trpc.chat.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockChatMutation,
      isPending: false,
    });

    (trpc.saveAsset.useMutation as jest.Mock).mockReturnValue({
      mutateAsync: mockSaveAssetMutation,
      isPending: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message and display the response', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ChatPage />
      </QueryClientProvider>
    );

    const input = screen.getByPlaceholderText("Describe what you'd like to create...");
    const sendButton = screen.getByRole('button', { name: /send/i });

    // Type a message and click send
    fireEvent.change(input, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    // Wait for the mock response to be displayed
    await waitFor(() => {
      expect(screen.getByText('This is a mock response')).toBeInTheDocument();
    });

    // Check if the input was cleared
    expect(input).toHaveValue('');
  });
});
