import api from "./api";

// LOGIN
export const login = (data) => {
  return api.post("/auth/login", data);
};

// SIGNUP
export const signup = (data) => {
  return api.post("/auth/signup", data);
};

// GET CURRENT USER
export const getMe = () => {
  return api.get("/auth/me");
};

// LOGOUT
export const logout = () => {
  return api.delete("/auth/logout");
};