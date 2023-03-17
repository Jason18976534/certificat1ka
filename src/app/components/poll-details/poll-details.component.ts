import { Component, Input } from '@angular/core';
import { Poll } from 'src/app/models/poll.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.css']
})
export class PollDetailsComponent {
  @Input() poll!: Poll;
  fullUrl!: string;
  certSize: number = 10000;
  filesToDelete!: any[];

  constructor(private uploadService: FileUploadService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fullUrl = window.location.href.replace('dashboard', 'certificate/' + this.poll.id);
  }

  deletePoll(poll: Poll): void {
    this.uploadService.deletePoll(poll.id.toString());
    this.uploadService.getFiles(this.certSize).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      ),
      take(1)
    ).subscribe(files => {
      this.filesToDelete = files;
      this.filesToDelete = this.filesToDelete.filter(item => item.pollId === this.poll.id);

      this.filesToDelete.forEach(item => this.uploadService.deleteFile(item));
    });

    this.toastr.success('Poll was deleted', 'Delete');
  }

  showCertificates(poll: Poll): void {
    this.router.navigate(['dashboard', poll.id]);
  }

  copyLink() {
    navigator.clipboard.writeText(this.fullUrl);
    this.toastr.info('Link was copied to clipboard', 'Info');
  }
}
