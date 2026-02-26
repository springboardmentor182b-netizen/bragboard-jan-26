import { config } from '../../../config/env';

const BASE_URL = `${config.apiBaseUrl}/admin/moderation`;

export const fetchReports = async () => {
  const res = await fetch(`${BASE_URL}/reports`);
  return res.json();
};

export const deleteShoutout = async (id) => {
  await fetch(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
};