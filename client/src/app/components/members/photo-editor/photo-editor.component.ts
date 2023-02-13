import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Photo } from 'src/app/models/photo';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MembersService } from 'src/app/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent {
  @Input() member: Member | undefined;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseURL = environment.apiURL;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }
  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseURL + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
      }
    };
  }
  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.mainPhotoURL = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoURL = photo.url;
          this.member.photos.forEach((p) => {
            p.isMain = false;
            if (p === photo) p.isMain = true;
          });
        }
      },
    });
  }
  deletePhoto(photo: Photo) {
    if (confirm('Are you sure you want to delete photo?')) {
      this.memberService.deletePhoto(photo.id).subscribe({
        next: () => {
          if (this.member) {
            this.member.photos.splice(
              this.member.photos.findIndex((p) => p.id == photo.id),
              1
            );
            console.log(this.member.photos);
          }
        },
      });
    }
  }
}
