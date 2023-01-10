import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseURL = environment.apiURL;

  constructor(private http:HttpClient) { }

  getMembers(){
    return this.http.get<Member[]>(this.baseURL + 'users');
  }

  getMemeber(username:string){
    return this.http.get<Member>(this.baseURL + 'users/' + username);
  }

  
}
