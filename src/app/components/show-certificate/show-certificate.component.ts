import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { map, take } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-certificate',
  templateUrl: './show-certificate.component.html',
  styleUrls: ['./show-certificate.component.css']
})
export class ShowCertificateComponent {
  pdfUrl!: SafeResourceUrl;
  fileUploads?: any[];
  fileUpload: any;
  certSize = 10000;

  userId!: string | null;
  recordNumber!: string | null;
  status!: string | null;

  pollId!: string | null;

  loading: boolean = true;

  constructor(private uploadService: FileUploadService, 
    private sanitizer: DomSanitizer, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true;
    
    this.route.paramMap.subscribe(params => {
      this.pollId = params.get('pollId');
    });

    this.userId = this.route.snapshot.queryParamMap.get('usr_id');
    this.recordNumber = this.route.snapshot.queryParamMap.get('recnum');
    this.status = this.route.snapshot.queryParamMap.get('status');

    if (this.userId != null) {
      this.uploadService.getFiles(this.certSize).snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        ),
        take(1)
      ).subscribe(fileUploads => {    
        this.fileUploads = fileUploads;
        this.fileUpload = this.fileUploads.find(item => item.pollId === this.pollId && item.expired === false || item.userId == this.userId);
        if (this.fileUpload != undefined) {
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUpload.url!);
          this.uploadService.setCertificateExpired(this.fileUpload, this.userId, this.recordNumber, this.status);
          this.loading = false;
        }
      });
    }
  }
}
