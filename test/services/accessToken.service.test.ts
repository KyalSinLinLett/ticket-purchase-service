import { AccessTokenService } from 'services/accessToken';
import { AccessTokenRepository } from 'services/accessToken/accessToken.repository';
import { AccessToken } from 'db/init';
import { FindOptions, InferAttributes } from 'sequelize';

describe('AccessTokenService unit tests', () => {
    let accessTokenService: AccessTokenService;
    let accessTokenRepositoryMock: jest.Mocked<AccessTokenRepository>;

    const mockAccessTokenData = {
        id: 'token-id',
        token: 'sample-token',
        userId: 'user-id',
        expiresAt: new Date()
    };

    const updatedAccessTokenData = {
        id: 'token-id',
        token: 'updated-token',
        userId: 'user-id',
        expiresAt: new Date()
    };

    beforeEach(() => {
        accessTokenRepositoryMock = {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<AccessTokenRepository>;

        accessTokenService = new AccessTokenService(accessTokenRepositoryMock);
    });

    it('should create an access token', async () => {
        accessTokenRepositoryMock.create.mockResolvedValue(mockAccessTokenData as any);

        const result = await accessTokenService.createAccessToken(mockAccessTokenData);

        expect(accessTokenRepositoryMock.create).toHaveBeenCalledWith(mockAccessTokenData);
        expect(result).toEqual(mockAccessTokenData);
    });

    it('should get an access token by condition', async () => {
        const condition: FindOptions<AccessToken> = { where: { token: 'sample-token' } };
        accessTokenRepositoryMock.findOne.mockResolvedValue(mockAccessTokenData as any);

        const result = await accessTokenService.getAccessToken(condition);

        expect(accessTokenRepositoryMock.findOne).toHaveBeenCalledWith(condition);
        expect(result).toEqual(mockAccessTokenData);
    });

    it('should get an access token by ID', async () => {
        accessTokenRepositoryMock.findById.mockResolvedValue(mockAccessTokenData as any);

        const result = await accessTokenService.getAccessTokenById(mockAccessTokenData.id);

        expect(accessTokenRepositoryMock.findById).toHaveBeenCalledWith(mockAccessTokenData.id);
        expect(result).toEqual(mockAccessTokenData);
    });

    it('should get all access tokens', async () => {
        accessTokenRepositoryMock.findAll.mockResolvedValue([mockAccessTokenData] as any);

        const result = await accessTokenService.getAllAccessTokens();

        expect(accessTokenRepositoryMock.findAll).toHaveBeenCalledWith();
        expect(result).toEqual([mockAccessTokenData]);
    });

    it('should update an access token', async () => {
        accessTokenRepositoryMock.findById.mockResolvedValue(mockAccessTokenData as any);
        accessTokenRepositoryMock.update.mockResolvedValue(updatedAccessTokenData as any);

        const result = await accessTokenService.updateAccessToken(mockAccessTokenData.id, updatedAccessTokenData);

        expect(accessTokenRepositoryMock.update).toHaveBeenCalledWith(mockAccessTokenData.id, updatedAccessTokenData);
        expect(result).toEqual(updatedAccessTokenData);
    });

    it('should delete an access token', async () => {
        accessTokenRepositoryMock.findById.mockResolvedValue(mockAccessTokenData as any);
        accessTokenRepositoryMock.delete.mockResolvedValue(null);

        const result = await accessTokenService.deleteAccessToken(mockAccessTokenData.id);

        expect(accessTokenRepositoryMock.delete).toHaveBeenCalledWith(mockAccessTokenData.id);
        expect(result).toBeNull();
    });

    it('should handle create access token failure', async () => {
        accessTokenRepositoryMock.create.mockRejectedValue(new Error('Creation failed'));

        await expect(accessTokenService.createAccessToken(mockAccessTokenData)).rejects.toThrow('Creation failed');
    });

    it('should handle get access token failure', async () => {
        const condition: FindOptions<AccessToken> = { where: { token: 'nonexistent-token' } };
        accessTokenRepositoryMock.findOne.mockRejectedValue(new Error('Find failed'));

        await expect(accessTokenService.getAccessToken(condition)).rejects.toThrow('Find failed');
    });

    it('should handle get access token by ID failure', async () => {
        accessTokenRepositoryMock.findById.mockRejectedValue(new Error('Find by ID failed'));

        await expect(accessTokenService.getAccessTokenById(mockAccessTokenData.id)).rejects.toThrow('Find by ID failed');
    });

    it('should handle get all access tokens failure', async () => {
        accessTokenRepositoryMock.findAll.mockRejectedValue(new Error('Get all failed'));

        await expect(accessTokenService.getAllAccessTokens()).rejects.toThrow('Get all failed');
    });

    it('should handle update access token failure', async () => {
        accessTokenRepositoryMock.findById.mockResolvedValue(mockAccessTokenData as any);
        accessTokenRepositoryMock.update.mockRejectedValue(new Error('Update failed'));

        await expect(accessTokenService.updateAccessToken(mockAccessTokenData.id, updatedAccessTokenData)).rejects.toThrow('Update failed');
    });

    it('should handle delete access token failure', async () => {
        accessTokenRepositoryMock.findById.mockResolvedValue(mockAccessTokenData as any);
        accessTokenRepositoryMock.delete.mockRejectedValue(new Error('Delete failed'));

        await expect(accessTokenService.deleteAccessToken(mockAccessTokenData.id)).rejects.toThrow('Delete failed');
    });
    
    it('should return null when access token to delete is not found', async () => {
        accessTokenRepositoryMock.findById.mockResolvedValue(null);

        const result = await accessTokenService.deleteAccessToken(mockAccessTokenData.id);

        expect(result).toBeUndefined();
    });
});