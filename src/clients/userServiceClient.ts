import axios from 'axios';
import { UserInfo } from '../types';

const GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:3000';

export const getUserById = async (userId: string): Promise<UserInfo> => {
  const response = await axios.get(`${GATEWAY_URL}/users/${userId}`, {
    headers: {
      'x-internal-key': process.env.INTERNAL_API_KEY || '',
    },
  });
  return response.data;
};
