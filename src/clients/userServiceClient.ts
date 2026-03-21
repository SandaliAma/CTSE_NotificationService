import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'https://localhost:5002';

export interface UserInfo {
  _id: string;
  email: string;
  username: string;
}

export const getUserById = async (userId: string): Promise<UserInfo> => {
  const sanitizedId = encodeURIComponent(userId);
  const url = new URL(`/users/${sanitizedId}`, USER_SERVICE_URL);
  const response = await axios.get(url.toString());
  return response.data;
};
