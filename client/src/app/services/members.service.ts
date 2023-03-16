import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, of } from "rxjs";
import { environment } from "src/environments/environment";
import { Member } from "../models/member";
import { PaginatedResult } from "../models/pagination";
import { User } from "../models/user";
import { UserParams } from "../models/userParams";
import { AccountService } from "./account.service";

@Injectable({
  providedIn: "root",
})
export class MembersService {
  baseURL = environment.apiURL;
  members: Member[] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  constructor(private http: HttpClient, private accoutService: AccountService) { }

  getMembers(userParams: UserParams) {
    const requestKey = Object.values(userParams).join("-");
    const response = this.memberCache.get(requestKey);
    if (response) return of(response);
    let params = this.getPaginationHeader(userParams);

    params = params.append("gender", userParams.gender);
    params = params.append("minAge", userParams.minAge);
    params = params.append("maxAge", userParams.maxAge);
    params = params.append("orderBy", userParams.orderBy);

    return this.getPaginatedResult<Member[]>(
      this.baseURL + "users",
      params
    ).pipe(
      map((response) => {
        this.memberCache.set(requestKey, response);
        return response;
      })
    );
  }

  getUserParams() {
    return this.userParams
  }
  setUserParams(params: UserParams) {
    this.userParams = params
  }
  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: "response", params }).pipe(
      map((response) => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get("Pagination");
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeader(userParams: UserParams) {
    let params = new HttpParams();
    params = params.append("pageNumber", userParams.pageNumber);
    params = params.append("pageSize", userParams.pageSize);
    return params;
  }


  getMemeber(username: string) {
    const result = [...this.memberCache.values()].reduce((arr, elm) => arr
      .concat(elm.result), [])
      .find((m: { username: string; }) => m.username == username);

    if (result) return of(result)
    ;
    return this.http.get<Member>(this.baseURL + "users/" + username).pipe(
      map((response) => {
        const defaultMembers = this.memberCache.get('default');
        defaultMembers.add(response);
        this.memberCache.set(defaultMembers, 'default');
        return of(response);
      })
    );
  }

  updateMember(member: Member) {
    return this.http.put(this.baseURL + "users", member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseURL + "users/set-main-photo/" + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseURL + "users/delete-photo/" + photoId);
  }
}
