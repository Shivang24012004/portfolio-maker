import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LayoutData } from '../models/layouts.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LayoutDataApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/layout_data`;

  list(limit = 20, offset = 0): Observable<LayoutData[]> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<LayoutData[]>(this.base, { params });
  }

  getById(id: string): Observable<LayoutData> {
    return this.http.get<LayoutData>(`${this.base}/${id}`);
  }

  getByLayoutId(layoutId: string): Observable<LayoutData> {
    return this.http.get<LayoutData>(`${this.base}/layout/${layoutId}`);
  }

  create(data: LayoutData): Observable<LayoutData> {
    return this.http.post<LayoutData>(this.base, data);
  }

  update(id: string, data: LayoutData): Observable<LayoutData> {
    return this.http.put<LayoutData>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
