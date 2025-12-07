import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { VideoPlayerComponent, VideoSource } from '../../components/video-player/video-player.component';

@Component({
  selector: 'app-upskill',
  standalone: true,
  imports: [CommonModule, TranslatePipe, VideoPlayerComponent],
  templateUrl: './upskill.component.html',
  styleUrl: './upskill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpskillComponent {

  readonly videoSources: VideoSource[] = [
    {
      src: 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/public/videos/oral_hygine.mp4',
      type: 'video/mp4',
    },
    {
      src: 'https://cdotngdpjgeeybbfdoit.supabase.co/storage/v1/object/public/nvc/videos/upskill-story-1080p.webm',
      type: 'video/webm',
    },
  ];

  readonly highlights = [
    {
      title: 'Upskill.expertise.title',
      description: 'Upskill.expertise.description',
    },
    {
      title: 'Upskill.results.title',
      description: 'Upskill.results.description',
    },
    {
      title: 'Upskill.partnership.title',
      description: 'Upskill.partnership.description',
    },
  ];
}

