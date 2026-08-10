import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Layout } from '../models/layouts.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LayoutApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/layout`;

  list(limit = 20, offset = 0): Observable<Layout[]> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http.get<Layout[]>(this.base, { params });
  }

  getById(id: string): Observable<Layout> {
    return this.http.get<Layout>(`${this.base}/${id}`);
  }

  create(layout: Layout): Observable<Layout> {
    return this.http.post<Layout>(this.base, layout);
  }

  update(id: string, layout: Layout): Observable<Layout> {
    return this.http.put<Layout>(`${this.base}/${id}`, layout);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
