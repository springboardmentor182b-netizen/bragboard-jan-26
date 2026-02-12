const BASE_URL = "http://localhost:8000/admin/moderation";

export const fetchReports = async () => {
  const res = await fetch(`${BASE_URL}/reports`);
  return res.json();
};

export const deleteShoutout = async (id) => {
  await fetch(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
};