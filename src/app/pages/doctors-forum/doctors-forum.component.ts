import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-doctors-forum',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './doctors-forum.component.html',
  styleUrl: './doctors-forum.component.scss'
})
export class DoctorsForumComponent {
  // PDF URL - can be updated to point to your PDF file
  // URL-encode spaces in the filename
  private pdfPath: string = '/PRODUCT%20TRIAL%20NUTRITIONAL%20SOFT%20PASTILLE_UTARACLINIC.pdf'; // Update this path to your actual PDF location
  pdfUrl: SafeResourceUrl;
  pdfPathForDownload: string; // Plain string path for download link

  constructor(private sanitizer: DomSanitizer) {
    // Plain string path for download link (with spaces URL-encoded)
    this.pdfPathForDownload = '/PRODUCT%20TRIAL%20NUTRITIONAL%20SOFT%20PASTILLE_UTARACLINIC.pdf';
    // Sanitize the PDF URL for safe use in iframe
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfPath);
  }
}

