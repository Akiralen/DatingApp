import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AgeBracket } from "src/app/models/age-bracket";
import { BasicSearch } from "src/app/models/basic-search";
import { User } from "src/app/models/user";
import { UserParams } from "src/app/models/userParams";
import { MembersService } from "src/app/services/members.service";

@Component({
  selector: "app-search-options",
  templateUrl: "./search-options.component.html",
  styleUrls: ["./search-options.component.css"],
})
export class SearchOptionsComponent {
  @Output() searchParams = new EventEmitter<BasicSearch>();

  basicSearchForm: FormGroup = new FormGroup({});
  userParams: UserParams | undefined;
  formSearchOptions: BasicSearch = {
    gender: "any",
    minAge: 18,
    maxAge: 100,
    sortBy: "none",
  };
  genderChoices: string[] = ["male", "female"];
  ageBracketChoices: AgeBracket[] = [];
  ageBoundaries: number[] = [18, 20, 25, 35, 60, 100];
  sortByChoices: any[] = [
    {
      text: "Last active",
      icon: "",
      value: "",
    },
    {
      text: "Name",
      icon: String.fromCharCode(parseInt("f15d", 16)),
      value: "name",
    },
    {
      text: "Name",
      icon: String.fromCharCode(parseInt("f15e", 16)),
      value: "name_d",
    },
    {
      text: "Age",
      icon: String.fromCharCode(parseInt("f162", 16)),
      value: "age",
    },
    {
      text: "Age",
      icon: String.fromCharCode(parseInt("f163", 16)),
      value: "age_d",
    },
  ];
  constructor(toast: ToastrService, public fb: FormBuilder, memberService: MembersService) {
    this.userParams = memberService.getUserParams()
    if (!this.userParams) this.userParams = {
      gender: 'any',
      minAge: 18,
      maxAge: 100,
      pageNumber: 1,
      pageSize: 5,
      orderBy: ""
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    //initialize age brackets
    this.ageBracketChoices = [{
      text: this.ageBoundaries[0] + '-' + this.ageBoundaries.slice(-1).pop(),
      minAge: this.ageBoundaries[0],
      maxAge: this.ageBoundaries.slice(-1).pop() ?? 100
    }]
    for (let i = 0; i < this.ageBoundaries.length - 1; i++) {
      this.ageBracketChoices.push({
        text: this.ageBoundaries[i] + "-" + this.ageBoundaries[i + 1],
        minAge: this.ageBoundaries[i],
        maxAge: this.ageBoundaries[i + 1],
      });
    }

    this.basicSearchForm = this.fb.group({
      gender: [this.userParams?.gender],
      ageBracket: [this.ageBracketChoices.
        find(e => e.minAge == this.userParams?.minAge && e.maxAge == this.userParams.maxAge) ?? this.ageBracketChoices[0]],
      sortBy: [this.sortByChoices.find(e => e.value == this.userParams?.orderBy) ?? this.sortByChoices[0]],
    });
  }

  changeGender(e: any) { }
  changeAge(e: any) { }
  changeSort(e: any) { }
  updateSearch() {
    var value: BasicSearch = {
      gender: this.basicSearchForm.value.gender,
      minAge: this.basicSearchForm.value.ageBracket.minAge,
      maxAge: this.basicSearchForm.value.ageBracket.maxAge,
      sortBy: this.basicSearchForm.value.sortBy.value,
    };
    this.searchParams.emit(value);
  }
}
