import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css']
})
export class UploadListComponent implements OnInit {
  fileUploads?: any[];
  certSize = 10000;

  pollId!: string | null;
  storageEventListener: any;

  countAll!: number;
  countViewed!: number;
  countActive!: number;

  constructor(private uploadService: FileUploadService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pollId = params.get('pollId');
    });

    this.uploadService.getFiles(this.certSize).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
      this.fileUploads = this.fileUploads.filter(f => f.pollId === this.pollId);
      
      this.fileUploads.sort((a, b) => {
        if (a.expired && !b.expired) {
          return -1;
        } else if (!a.expired && b.expired) {
          return 1;
        } else {
          return 0;
        }
      });

      this.countAll = this.fileUploads.length;
      this.countViewed = this.fileUploads.filter(item => item.expired).length;
      this.countActive = this.countAll - this.countViewed;
    });
  }
}
