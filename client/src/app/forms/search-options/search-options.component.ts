import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AgeBracket } from "src/app/models/age-bracket";
import { BasicSearch } from "src/app/models/basic-search";
import { User } from "src/app/models/user";

@Component({
  selector: "app-search-options",
  templateUrl: "./search-options.component.html",
  styleUrls: ["./search-options.component.css"],
})
export class SearchOptionsComponent {
  @Input() user: User | undefined;
  @Output() searchParams = new EventEmitter<BasicSearch>();

  basicSearchForm: FormGroup = new FormGroup({});
  formSearchOptions: BasicSearch = {
    gender: "any",
    minAge: 18,
    maxAge: 100,
    sortBy: "none",
  };
  genderChoices: string[] = ["male", "female"];
  ageBracketChoices: AgeBracket[] = [];
  ageBoundaries: number[] = [18, 20, 25, 35, 60];
  sortByChoices: any[] = [
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
  constructor(toast: ToastrService, public fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    //initialize age brackets
    for (let i = 0; i < this.ageBoundaries.length - 1; i++) {
      this.ageBracketChoices.push({
        text: this.ageBoundaries[i] + "-" + this.ageBoundaries[i + 1],
        minAge: this.ageBoundaries[i],
        maxAge: this.ageBoundaries[i + 1],
      });
    }

    this.basicSearchForm = this.fb.group({
      gender: ["any"],
      ageBracket: [{ text: "any", minAge: 18, maxAge: 100 }],
      sortBy: [{ text: "Last active", icon: "", value: "" }],
    });
  }

  changeGender(e: any) {}
  changeAge(e: any) {}
  changeSort(e: any) {}
  updateSearch() {
    var value: BasicSearch = {
      gender: this.basicSearchForm.value.gender,
      minAge: this.basicSearchForm.value.ageBracket.minAge,
      maxAge: this.basicSearchForm.value.ageBracket.maxAge,
      sortBy: this.basicSearchForm.value.sortBy.value,
    };
    console.log(value);
    this.searchParams.emit(value);
  }
}
