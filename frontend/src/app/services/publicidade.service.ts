import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublicidadeService {
  private apiUrl = 'http://localhost:3000/api/v1/publicidades';

  constructor(private http: HttpClient) {}

  getPublicidades(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createComImagem(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateComImagem(id: number, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePublicidade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}