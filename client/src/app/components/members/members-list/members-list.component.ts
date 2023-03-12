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
  userParams: UserParams = {
    gender: "any",
    minAge: 18,
    maxAge: 100,
    pageNumber: 1,
    pageSize: 5,
    orderBy: "",
  };

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  pageChanged(event: any): void {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      if (this.pagination) this.pagination.currentPage = event.page;
      this.loadMembers();
    }
  }

  loadMembers() {
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
    if (this.pagination) {
      this.userParams.pageSize = itemsPerPage;
      this.pagination.currentPage = 1;
      this.loadMembers();
    }
  }

  searchParamsUpdate(e: any) {
    if (e.gender) this.userParams.gender = e.gender;
    else this.userParams.gender = "any";
    if (e.minAge) this.userParams.minAge = e.minAge;
    else this.userParams.minAge = 18;
    if (e.maxAge) this.userParams.maxAge = e.maxAge;
    else this.userParams.maxAge = 100;
    if (e.sortBy) this.userParams.orderBy = e.sortBy;
    console.log(this.userParams);
    this.loadMembers();
  }
}
