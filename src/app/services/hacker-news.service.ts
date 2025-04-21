import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Story } from '../models/Story.model';

@Injectable({
  providedIn: 'root'
})
export class HackerNewsService {
  private apiUrl = 'https://localhost:7093/api/Stories';

  constructor(private http: HttpClient) { }

  getStoryCount(search: string = ''): Observable<number> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<number>(`${this.apiUrl}/story-count`, { params });
  }

  getStories(search: string = '', page: number = 1, pageSize: number = 10): Observable<Story[]> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Story[]>(`${this.apiUrl}/stories`, { params });
  }
}
