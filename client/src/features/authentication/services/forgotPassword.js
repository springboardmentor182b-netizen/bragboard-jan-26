import API from "./api";

export const forgotPassword = (email) =>
  API.post("/auth/forgot-password", { email });
