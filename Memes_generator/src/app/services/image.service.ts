import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../models/Image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) { }

  uri = 'http://localhost:3000/image/';

  getImageByMemes(id: number): Observable<any> {
      return this.http.get<Image>(this.uri +  id);
    }

}
