
import { prisma } from '@/lib/db';
import { saveAsset, getAssets, getConversationAssets } from '@/trpc/procedures/assets';

jest.mock('@/lib/db', () => ({
  prisma: {
    asset: {
      update: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('Asset Procedures', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAsset', () => {
    it('should save an asset', async () => {
      const mockAsset = { id: '1', saved: true };
      (prisma.asset.update as jest.Mock).mockResolvedValue(mockAsset);

      const result = await saveAsset('1');

      expect(prisma.asset.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { saved: true },
      });
      expect(result).toEqual(mockAsset);
    });
  });

  describe('getAssets', () => {
    it('should return saved assets', async () => {
      const mockAssets = [{ id: '1', saved: true }];
      (prisma.asset.findMany as jest.Mock).mockResolvedValue(mockAssets);

      const result = await getAssets();

      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: { saved: true },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockAssets);
    });
  });

  describe('getConversationAssets', () => {
    it('should return saved assets for a conversation', async () => {
      const mockAssets = [{ id: '1', saved: true, conversationId: 'conv1' }];
      (prisma.asset.findMany as jest.Mock).mockResolvedValue(mockAssets);

      const result = await getConversationAssets('conv1');

      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: { saved: true, conversationId: 'conv1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockAssets);
    });
  });
});
