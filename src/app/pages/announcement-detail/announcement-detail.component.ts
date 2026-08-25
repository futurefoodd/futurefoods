import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

interface Announcement {
  id: string;
  image: string;
  titleKey: string;
  dateKey: string;
  descriptionKey: string;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'rotary-health-talk',
    image: 'rotary2.jpeg',
    titleKey: 'Landing.Announcement.event1.title',
    dateKey: 'Landing.Announcement.event1.date',
    descriptionKey: 'Landing.Announcement.event1.description'
  },
  {
    id: 'nice-26-expo',
    image: 'nice.jpeg',
    titleKey: 'Landing.Announcement.event2.title',
    dateKey: 'Landing.Announcement.event2.date',
    descriptionKey: 'Landing.Announcement.event2.description'
  }
];

@Component({
  selector: 'app-announcement-detail',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './announcement-detail.component.html',
  styleUrl: './announcement-detail.component.scss'
})
export class AnnouncementDetailComponent implements OnInit {
  announcement: Announcement | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.announcement = ANNOUNCEMENTS.find(a => a.id === id);

    if (!this.announcement) {
      this.router.navigate(['']);
    }
  }
}
