import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { take } from 'rxjs'
import { Member } from 'src/app/models/member'
import { User } from 'src/app/models/user'
import { AccountService } from 'src/app/services/account.service'
import { MembersService } from 'src/app/services/members.service'

@Component({
  selector: 'app-members-edit',
  templateUrl: './members-edit.component.html',
  styleUrls: ['./members-edit.component.css'],
})
export class MembersEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm|undefined;
  member: Member | undefined;
  user: User | null = null;

  constructor(private accountService:AccountService,private memberService:MembersService,
    private toaster: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next:user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    if(!this.user) return;
    this.memberService.getMemeber(this.user.username).subscribe({
      next: member=>{
        this.member = member;
      }
    })
  }

  updateMember(){
    console.log(this.member);
    this.toaster.success('Profile have been updated');
    this.editForm?.reset(this.member)
  }


}
