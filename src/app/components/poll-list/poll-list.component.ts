import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent {
  polls?: any[];
  certSize = 10000;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.getPolls();
  }

  getPolls(): void {
    this.uploadService.getAllPolls().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ pid: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.polls = data;
    });
  }
}
