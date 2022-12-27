import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();

  model: any = {}

  constructor(private accoountService:AccountService,private router:Router) { }

  ngOnInit(): void {
  }

  register(){
    this.accoountService.register(this.model).subscribe({
      next: response =>{
        this.cancel();
        this.router.navigateByUrl('/members');
      },
      error:error => console.log(error)
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }

}
