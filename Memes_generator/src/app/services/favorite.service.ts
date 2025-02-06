import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Favorite } from '../models/Favorite';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:3000/favorite';

  addFavotite(favorite: Favorite): Observable<any> {
    return this.http.post<any>(this.uri, favorite);
  }

  ifUserFavorite(id: number): Observable<any> {
    return this.http.get<Favorite>(this.uri + '/if_user/' + id);
  }

  deleteFavorite(id: number): Observable<any> {
    return this.http.delete<Favorite>(this.uri+'/' + id);
  }
}
