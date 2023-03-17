import { Component, OnInit, Input } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileUpload } from 'src/app/models/file-upload.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.css']
})
export class UploadDetailsComponent implements OnInit {
  @Input() fileUpload!: FileUpload;

  constructor(private uploadService: FileUploadService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  deleteFileUpload(fileUpload: FileUpload): void {
    this.uploadService.deleteFile(fileUpload);
    this.toastr.success('Certificate was deleted', 'Delete')
  }

  activateFile(fileUpload: FileUpload): void {
    this.uploadService.activateFile(fileUpload);
    this.toastr.info('Certificate was activated', 'Info')
  }
}
