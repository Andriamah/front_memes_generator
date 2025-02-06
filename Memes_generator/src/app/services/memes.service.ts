import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Memes } from '../models/Memes';

@Injectable({
  providedIn: 'root'
})
export class MemesService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:3000/memes/';

  addMemes(memes: any): Observable<any> {
    return this.http.post<any>(this.uri , memes);
  }

  getAllMemes(): Observable<any> {
    return this.http.get<Memes>(this.uri )
  }

  getAllMemesByUser(): Observable<any> {
    return this.http.get<Memes>(this.uri +'creator/' )
  }

  getAllMemesFavoriteByUser(): Observable<any> {
    return this.http.get<Memes>(this.uri +'favorite/' )
  }
}
