import type { Layout } from "../domain/layouts";
import { request } from "./http";

export const layoutApi = {
  list(limit = 20, offset = 0) {
    return request<Layout[]>(`/layout?limit=${limit}&offset=${offset}`);
  },
  getById(id: string) {
    return request<Layout>(`/layout/${id}`);
  },
  create(layout: Layout) {
    return request<Layout>("/layout", {
      method: "POST",
      body: JSON.stringify(layout),
    });
  },
  update(id: string, layout: Layout) {
    return request<Layout>(`/layout/${id}`, {
      method: "PUT",
      body: JSON.stringify(layout),
    });
  },
  delete(id: string) {
    return request<void>(`/layout/${id}`, { method: "DELETE" });
  },
};
