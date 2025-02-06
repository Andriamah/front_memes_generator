import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri = 'http://localhost:3000/user/';

  addNewUser(newUser: User): Observable<any> {
    return this.http.post<any>(this.uri + 'register', newUser);
  }

  login(credentials: { username: string | null | undefined; password: string | null | undefined; }): Observable<any> {
    return this.http.post<any>(this.uri + 'login', credentials);
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put<User>(this.uri , userData);
  }

}
