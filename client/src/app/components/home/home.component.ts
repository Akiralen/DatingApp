import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerForm = false;
  users : any = {};

  constructor() { }

  ngOnInit(): void {
  }

  RegisterFormToggle(){
    this.registerForm = !this.registerForm;
  }

  cancelRegisterMode(event:boolean){
    this.registerForm = event;
  }
}
