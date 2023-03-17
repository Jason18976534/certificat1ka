import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-poll-add-form',
  templateUrl: './poll-add-form.component.html',
  styleUrls: ['./poll-add-form.component.css']
})
export class PollAddFormComponent {
  pollId!: string;
  pollName!: string;

  constructor(private uploadService: FileUploadService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const min = 100000;
    const max = 999999;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    this.pollId = randomNum.toString();
  }

  upload(): void {
    this.uploadService.addPollData({id: this.pollId, name: this.pollName}).snapshotChanges().pipe(
      map((changes: any) =>
        changes.map((c: any) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(() => this.toastr.success('Poll was created', 'Create'));
  }
}