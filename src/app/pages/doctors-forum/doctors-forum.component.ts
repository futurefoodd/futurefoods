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
  private pdfPath: string = '/PRODUCT TRIAL NUTRITIONAL SOFT PASTILLE_UTARACLINIC.pdf'; // Update this path to your actual PDF location
  pdfUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Sanitize the PDF URL for safe use in iframe
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfPath);
  }
}

