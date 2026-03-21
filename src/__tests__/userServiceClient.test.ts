import axios from 'axios';
import { getUserById } from '../clients/userServiceClient';

jest.mock('axios');

describe('userServiceClient', () => {
  it('should fetch user by id', async () => {
    const mockUser = { _id: 'u1', email: 'test@test.com', username: 'test' };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockUser });

    const result = await getUserById('u1');

    expect(result).toEqual(mockUser);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/users/u1'));
  });

  it('should throw on failure', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(getUserById('u1')).rejects.toThrow('Network error');
  });
});
