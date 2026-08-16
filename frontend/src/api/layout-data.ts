import type { LayoutData } from "../domain/layouts";
import { request } from "./http";

export interface CreateLayoutDataPayload {
  id?: string;
  name: string;
  version?: number;
  content: Record<string, unknown>;
}

export interface UpdateLayoutDataPayload {
  id?: string;
  name?: string;
  version?: number;
  content: Record<string, unknown>;
}

export const layoutDataApi = {
  list(limit = 50, offset = 0) {
    return request<LayoutData[]>(`/layout_data?limit=${limit}&offset=${offset}`);
  },
  getById(id: string) {
    return request<LayoutData>(`/layout_data/${id}`);
  },
  create(data: CreateLayoutDataPayload) {
    return request<LayoutData>("/layout_data", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update(id: string, data: UpdateLayoutDataPayload) {
    return request<LayoutData>(`/layout_data/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete(id: string) {
    return request<void>(`/layout_data/${id}`, { method: "DELETE" });
  },
};
