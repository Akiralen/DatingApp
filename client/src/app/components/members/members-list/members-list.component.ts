import { Component, OnInit } from "@angular/core";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { Observable } from "rxjs";
import { BasicSearch } from "src/app/models/basic-search";
import { Member } from "src/app/models/member";
import { Pagination } from "src/app/models/pagination";
import { UserParams } from "src/app/models/userParams";
import { MembersService } from "src/app/services/members.service";

@Component({
  selector: "app-members-list",
  templateUrl: "./members-list.component.html",
  styleUrls: ["./members-list.component.css"],
})
export class MembersListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  loadedUser: string | undefined;
  pagination: Pagination | undefined;
  pageSizes = [3, 5, 10, 25];
  userParams: UserParams | undefined;

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
    if (!this.userParams) {
      this.userParams = {
        gender: 'any',
        minAge: 18,
        maxAge: 99,
        orderBy: '',
        pageNumber: 1,
        pageSize: 5
      }
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  pageChanged(event: any): void {
    if (this.userParams)
      if (this.userParams.pageNumber !== event.page) {
        this.userParams.pageNumber = event.page;
        if (this.pagination) this.pagination.currentPage = event.page;
        this.loadMembers();
      }
  }

  loadMembers() {
    if (this.userParams)
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        },
      });
  }

  setItemsPerPage(itemsPerPage: number) {
    if (this.userParams)
      if (this.pagination) {
        this.userParams.pageSize = itemsPerPage;
        this.pagination.currentPage = 1;
        this.loadMembers();
      }
  }

  searchParamsUpdate(e: any) {
    var params = new UserParams();
    if (e.gender) params.gender = e.gender;
    if (e.minAge) params.minAge = e.minAge;
    if (e.maxAge) params.maxAge = e.maxAge;
    if (e.sortBy) params.orderBy = e.sortBy;
    params.pageNumber = this.userParams ? this.userParams.pageNumber : 1;
    params.pageSize = this.userParams ? this.userParams.pageSize : 5;
    this.userParams = params;
    this.memberService.setUserParams(params);
    this.loadMembers();
  }
}
