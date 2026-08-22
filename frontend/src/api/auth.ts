import type { TokenResponse, User, UserLoginPayload, UserRegisterPayload } from "../domain/auth";
import { request } from "./http";

export const authApi = {
  register(data: UserRegisterPayload) {
    return request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  login(data: UserLoginPayload) {
    return request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getMe() {
    return request<User>("/auth/me");
  },
};
