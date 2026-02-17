import API from "./api";

export const signupUser = (data) =>
  API.post("/auth/register", data);
