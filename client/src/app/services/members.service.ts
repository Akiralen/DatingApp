import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseURL = environment.apiURL;
  members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseURL + 'users').pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMemeber(username: string) {
    const member = this.members.find((x) => x.username === username);
    if (member) return of(member);
    return this.http.get<Member>(this.baseURL + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseURL + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }
}
