
import { prisma } from '@/lib/db';
import { chat } from '@/trpc/procedures/chat';
import { run } from '@openai/agents';
import { Role } from '@prisma/client';

jest.mock('@/lib/db', () => ({
  prisma: {
    conversation: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    message: {
      createMany: jest.fn(),
    },
    asset: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/ai/agent', () => ({
  createConversationAgent: jest.fn(),
}));

jest.mock('@openai/agents', () => ({
  run: jest.fn(),
  user: jest.fn((content) => ({ type: 'user', content })),
  assistant: jest.fn((content) => ({ type: 'assistant', content })),
}));

describe('Chat Procedure', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle a new conversation', async () => {
    const mockConversation = {
      id: 'conv1',
      messages: [],
    };
    const mockResponse = {
      finalOutput: 'This is a test response',
      history: [],
    };
    const mockAssets = [{ id: 'asset1', url: 'http://test.com/img.png', type: 'IMAGE' }];

    (prisma.conversation.create as jest.Mock).mockResolvedValue(mockConversation);
    (run as jest.Mock).mockImplementation(async (agent, messages, options) => {
      options.context.assets.push({ url: 'http://test.com/img.png', type: 'IMAGE' });
      return mockResponse;
    });
    (prisma.asset.findMany as jest.Mock).mockResolvedValue(mockAssets);

    const result = await chat('Hello');

    expect(prisma.conversation.create).toHaveBeenCalled();
    expect(run).toHaveBeenCalled();
    expect(prisma.message.createMany).toHaveBeenCalledWith({
      data: [
        { role: Role.USER, content: 'Hello', conversationId: 'conv1' },
        { role: Role.ASSISTANT, content: 'This is a test response', conversationId: 'conv1' },
      ],
    });
    expect(prisma.asset.createMany).toHaveBeenCalled();
    expect(result.message.content).toBe('This is a test response');
    expect(result.assets).toEqual(mockAssets);
    expect(result.conversationId).toBe('conv1');
  });
});
