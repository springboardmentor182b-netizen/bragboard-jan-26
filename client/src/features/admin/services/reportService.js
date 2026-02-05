const BASE_URL = "http://127.0.0.1:8000";

export const fetchReports = async () => {
  const response = await fetch(`${BASE_URL}/admin/reports`);
  return response.json();
};

export const resolveReport = async (reportId) => {
  await fetch(`${BASE_URL}/admin/reports/${reportId}/resolve`, {
    method: "POST",
  });
};

export const deleteShoutout = async (shoutoutId) => {
  await fetch(`${BASE_URL}/admin/reports/shoutout/${shoutoutId}`, {
    method: "DELETE",
  });
};
