import axios from 'axios';

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'https://localhost:5002';

export interface UserInfo {
  _id: string;
  email: string;
  username: string;
}

export const getUserById = async (userId: string): Promise<UserInfo> => {
  const sanitizedId = encodeURIComponent(userId);
  const url = new URL(`/users/${sanitizedId}`, API_GATEWAY_URL);
  const response = await axios.get(url.toString());
  return response.data;
};
