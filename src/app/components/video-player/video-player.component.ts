import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

export interface VideoSource {
  src: string;
  type?: string;
}

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) sources: VideoSource[] = [];
  @Input() poster = '';
  @Input() title = 'Video player';
  @Input() preload: 'none' | 'metadata' | 'auto' = 'none';
  @Input() muted = false;
  @Input() loop = false;
  @Input() playsInline = true;
  @Input() showControls = true;

  @ViewChild('videoEl') private videoEl?: ElementRef<HTMLVideoElement>;

  public hasInteracted = false;
  public isPlaying = false;
  public isLoading = false;
  public playbackError: string | null = null;

  private readonly isBrowser: boolean;
  private intersectionObserver?: IntersectionObserver;
  private isIntersecting = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get description(): string {
    return `${this.title}${this.muted ? ', muted' : ''}`;
  }

  get shouldRenderSources(): boolean {
    if (this.sources.length === 0) {
      return false;
    }

    if (this.hasInteracted) {
      return true;
    }

    if (this.preload === 'none') {
      return false;
    }

    return this.isIntersecting;
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.videoEl) {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isIntersecting = true;

            if (this.preload !== 'none' && !this.hasInteracted) {
              // Load metadata once the component is in view
              this.videoEl?.nativeElement.load();
            }
          } else {
            this.isIntersecting = false;
            if (this.isPlaying) {
              this.pauseVideo();
            }
          }
        });
      },
      { threshold: 0.25 },
    );

    this.intersectionObserver.observe(this.videoEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  async handlePlayRequest(): Promise<void> {
    if (!this.isBrowser || !this.videoEl?.nativeElement) {
      return;
    }

    if (this.sources.length === 0) {
      this.playbackError = 'Video sources are not configured.';
      return;
    }

    this.hasInteracted = true;
    this.isLoading = true;
    this.playbackError = null;

    const videoElement = this.videoEl.nativeElement;

    if (this.preload === 'none') {
      await this.waitForNextFrame();
      videoElement.load();
    }

    try {
      await videoElement.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('Video playback failed', error);
      this.playbackError =
        error instanceof Error ? error.message : 'Unable to start playback.';
    } finally {
      this.isLoading = false;
    }
  }

  pauseVideo(): void {
    if (!this.isBrowser || !this.videoEl?.nativeElement) {
      return;
    }

    this.videoEl.nativeElement.pause();
    this.isPlaying = false;
  }

  handleVideoPlay(): void {
    this.isPlaying = true;
    this.isLoading = false;
  }

  handleVideoPause(): void {
    this.isPlaying = false;
  }

  handleVideoEnded(): void {
    this.isPlaying = this.loop;
    if (!this.loop) {
      this.hasInteracted = false;
    }
  }

  handleVideoError(): void {
    this.isLoading = false;
    this.playbackError = 'There was a problem loading the video.';
  }

  private waitForNextFrame(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.resolve();
    }

    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }

  @HostListener('document:keydown.enter', ['$event'])
  @HostListener('document:keydown.space', ['$event'])
  handleKeyboardPlay(event: KeyboardEvent): void {
    if (!this.isBrowser || !this.videoEl) {
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target || !target.classList.contains('video-player__overlay') && !target.classList.contains('video-player__play-button')) {
      return;
    }

    event.preventDefault();
    void this.handlePlayRequest();
  }
}

