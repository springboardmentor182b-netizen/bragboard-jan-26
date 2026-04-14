export const fetchReports = async () => {
  const response = await fetch("/admin/reports/");
  return response.json();
};

export const resolveReport = async (reportId) => {
  await fetch(`/admin/reports/${reportId}/resolve`, {
    method: "POST",
  });
};

export const deleteShoutout = async (shoutoutId) => {
  await fetch(`/admin/reports/shoutout/${shoutoutId}`, {
    method: "DELETE",
  });
};