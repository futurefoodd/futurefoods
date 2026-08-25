import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { VideoPlayerComponent, VideoSource } from '../../components/video-player/video-player.component';

// Declare PptxViewJS as a global type
declare const PptxViewJS: any;

@Component({
  selector: 'app-upskill',
  standalone: true,
  imports: [TranslatePipe, VideoPlayerComponent],
  templateUrl: './upskill.component.html',
  styleUrl: './upskill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpskillComponent {
  // PowerPoint Preview - Commented out for now
  // @ViewChild('pptxViewerContainer', { static: false }) pptxViewerContainer!: ElementRef<HTMLDivElement>;

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

  // PPTX file URL - using local public asset
  // Served from /public; path resolves to {origin}/upskill_pptx.pptx
  readonly pptxUrl: string | null = '/upskill_pptx.pptx';

  viewer: any = null;
  viewerInitialized: boolean = false;
  isLoading: boolean = false;
  loadError: string | null = null;
  currentSlideIndex: number = 0;
  totalSlides: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // PowerPoint Preview - Commented out for now
  // ngAfterViewInit(): void {
  //   if (isPlatformBrowser(this.platformId) && this.pptxUrl && this.pptxViewerContainer) {
  //     // Wait a bit for scripts to load if they're still loading
  //     if (typeof PptxViewJS === 'undefined') {
  //       // Retry after a short delay
  //       setTimeout(() => {
  //         if (typeof PptxViewJS !== 'undefined') {
  //           this.initializeViewer();
  //         } else {
  //           this.loadError = 'PptxViewJS library not loaded. Please check your internet connection.';
  //           this.isLoading = false;
  //           this.cdr.markForCheck();
  //         }
  //       }, 500);
  //     } else {
  //       this.initializeViewer();
  //     }
  //   }
  // }

  // private initializeViewer(): void {
  //   if (typeof PptxViewJS === 'undefined') {
  //     this.loadError = 'PptxViewJS library not loaded. Please check your internet connection.';
  //     this.isLoading = false;
  //     this.cdr.markForCheck();
  //     return;
  //   }

  //   if (!this.pptxViewerContainer?.nativeElement) {
  //     return;
  //   }

  //   this.isLoading = true;
  //   this.cdr.markForCheck();

  //   try {
  //     // Initialize the viewer
  //     this.viewer = new PptxViewJS.Viewer(this.pptxViewerContainer.nativeElement, {
  //       width: '100%',
  //       height: '600px',
  //       backgroundColor: '#f5f5f5',
  //     });

  //     // Load the PPTX file
  //     const loadPromise = this.viewer.load(this.pptxUrl);
      
  //     if (loadPromise && typeof loadPromise.then === 'function') {
  //       // Promise-based API
  //       loadPromise
  //         .then(() => {
  //           this.onViewerLoaded();
  //         })
  //         .catch((error: any) => {
  //           this.onViewerError(error);
  //         });
  //     } else {
  //       // Callback-based or synchronous API
  //       try {
  //         this.onViewerLoaded();
  //       } catch (error: any) {
  //         this.onViewerError(error);
  //       }
  //     }
  //   } catch (error: any) {
  //     this.onViewerError(error);
  //   }
  // }

  // private onViewerLoaded(): void {
  //   this.viewerInitialized = true;
    
  //   // Try to get slide count using different possible API methods
  //   if (typeof this.viewer.getSlideCount === 'function') {
  //     this.totalSlides = this.viewer.getSlideCount();
  //   } else if (typeof this.viewer.getTotalSlides === 'function') {
  //     this.totalSlides = this.viewer.getTotalSlides();
  //   } else if (this.viewer.slides && Array.isArray(this.viewer.slides)) {
  //     this.totalSlides = this.viewer.slides.length;
  //   } else {
  //     this.totalSlides = 1; // Default to 1 if we can't determine
  //   }
    
  //   this.currentSlideIndex = 0;
  //   this.isLoading = false;
  //   this.loadError = null;
  //   this.cdr.markForCheck();

  //   // Listen for slide changes if the API supports it
  //   if (typeof this.viewer.on === 'function') {
  //     this.viewer.on('slideChange', (index: number) => {
  //       this.currentSlideIndex = index;
  //       this.cdr.markForCheck();
  //     });
  //   } else if (typeof this.viewer.addEventListener === 'function') {
  //     this.viewer.addEventListener('slideChange', (event: any) => {
  //       this.currentSlideIndex = event.detail?.index || 0;
  //       this.cdr.markForCheck();
  //     });
  //   }
  // }

  // private onViewerError(error: any): void {
  //   console.error('Error loading PPTX file:', error);
  //   this.loadError = 'Failed to load presentation. Please check the file URL and try again.';
  //   this.isLoading = false;
  //   this.viewerInitialized = false;
  //   this.cdr.markForCheck();
  // }

  // nextSlide(): void {
  //   if (this.viewer && this.currentSlideIndex < this.totalSlides - 1) {
  //     if (typeof this.viewer.next === 'function') {
  //       this.viewer.next();
  //     } else if (typeof this.viewer.goToSlide === 'function') {
  //       this.viewer.goToSlide(this.currentSlideIndex + 1);
  //     } else if (typeof this.viewer.goto === 'function') {
  //       this.viewer.goto(this.currentSlideIndex + 1);
  //     }
  //     this.currentSlideIndex++;
  //     this.cdr.markForCheck();
  //   }
  // }

  // previousSlide(): void {
  //   if (this.viewer && this.currentSlideIndex > 0) {
  //     if (typeof this.viewer.previous === 'function') {
  //       this.viewer.previous();
  //     } else if (typeof this.viewer.goToSlide === 'function') {
  //       this.viewer.goToSlide(this.currentSlideIndex - 1);
  //     } else if (typeof this.viewer.goto === 'function') {
  //       this.viewer.goto(this.currentSlideIndex - 1);
  //     }
  //     this.currentSlideIndex--;
  //     this.cdr.markForCheck();
  //   }
  // }

  downloadPptx(): void {
    if (!this.pptxUrl) {
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = this.pptxUrl;
      link.download = 'upskill-presentation.pptx';
      link.style.display = 'none';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

