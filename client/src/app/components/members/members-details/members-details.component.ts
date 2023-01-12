import { PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/models/member'
import { MembersService } from 'src/app/services/members.service'

@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.css'],
})
export class MembersDetailsComponent implements OnInit {
  member: Member | undefined;
  galleryOptions: NgxGalleryOptions[]=[];
  galleryImages: NgxGalleryImage[]=[];
  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadMember();
    this.galleryOptions = [
      {
        width:"500px",
        height:"500px",
        imagePercent:100,
        thumbnailsColumns:4,
        imageAnimation:NgxGalleryAnimation.Slide,
        preview:false
      }
    ]

    this.galleryImages = this.getImages();
  }
  loadMember() {
    const username = this.route.snapshot.paramMap.get('username')
    if (username) {
      this.memberService.getMemeber(username).subscribe({
        next:member=>this.member=member
      })
    }
  }
  getImages(){
    if(!this.member) return [];
    const imageUrls = [];
    for(const photo of this.member.photos){
      imageUrls.push({
        small: photo.url,
        medium:photo.url,
        big:photo.url
      })
    }
    return imageUrls;
  }
}
