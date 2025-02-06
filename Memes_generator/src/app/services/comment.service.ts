import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:3000/comment/';

  getCommentByMeme(id: number): Observable<any> {
    return this.http.get<Comment>(this.uri + id);
  }
  addComment(comment: Comment): Observable<any> {
    return this.http.post<any>(this.uri , comment);
  }

}
