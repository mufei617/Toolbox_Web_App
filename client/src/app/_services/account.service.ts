import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_model/users';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  static setCurrentUser: any;

  constructor(private http: HttpClient) { }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }


  convertVideo(model:any){
    return this.http.post<User>(this.baseUrl + 'tools/convertvideo', model)

  }
  login(model: any) {
    return this.http.post<User>(this.baseUrl + 'user/login', model)
      .pipe(
        map(user => {
          this.setCurrentUser(user); // 设置当前用户
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user')
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'user/register', model)
  }

  getallUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'user/getallusers');
  }

  updateUsername(model:any) {
    return this.http.put<User>(this.baseUrl+'user/changeusername',model)

  }
  updatePassword(model: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'user/changepassword', model);
  }

  deleteUser(model: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'user/delete', model);
  }
  updateUserRole(model: any): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'account/changeroleid', model);
  }
}
