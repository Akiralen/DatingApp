import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  minAge = environment.minAge;
  validationErrors: string[] | undefined;

  constructor(
    private accoountService: AccountService,
    private router: Router,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - this.minAge);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', [Validators.required, Validators.minLength(3)]],
      knownAs: ['', Validators.required],
      dateOfBirth: [new Date(1978, 1, 1), Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    console.log(this.registerForm.value);
    const date = this.getDateOnly(
      this.registerForm.controls['dateOfBirth'].value
    );
    const values = { ...this.registerForm.value, dateOfBirth: date };
    console.log(values);
    this.accoountService.register(values).subscribe({
      next: (response) => {
        this.cancel();
        this.router.navigateByUrl('/member/edit');
      },
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private getDateOnly(date: string | undefined) {
    if (!date) return;
    let newDate = new Date(date);
    var options = { year : 'numeric', month : '2-digit', day : '2-digit' }
    return newDate.toLocaleDateString('fr-CA');
  }
}
