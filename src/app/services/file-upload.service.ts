import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';
import { Poll } from '../models/poll.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private certPath = '/certificates';
  emptyResult$: Observable<number | undefined> = new Observable<number | undefined>();

  private pollsPath = '/polls';
  pollsRef: AngularFirestoreCollection<Poll>;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage,
    private store: AngularFirestore, private toastr: ToastrService) { 
      this.pollsRef = store.collection(this.pollsPath);
    }

  pushFileToStorage(fileUpload: FileUpload, pollId: string): Observable<number | undefined> {
    if (fileUpload.file.type != 'application/pdf') {
      window.alert("Wrong file format. PDF files only!");
      return this.emptyResult$;
    }

    const filePath = `${this.certPath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;  
          fileUpload.pollId = pollId;
          this.saveFileData(fileUpload);
          this.toastr.success('Certificate was added', 'Add')
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  setCertificateExpired(fileUpload: FileUpload, userId: string | null,
    recordNumber: string | null, status: string | null): void {
    fileUpload.expired = true;
    fileUpload.userId = userId!;
    fileUpload.recordNumber = recordNumber!;
    fileUpload.status = status!;

    this.db.list(this.certPath).set(fileUpload.key, fileUpload);
  }

  activateFile(fileUpload: FileUpload) {
    fileUpload.expired = false;
    fileUpload.userId = '';
    this.db.list(this.certPath).set(fileUpload.key, fileUpload);
  }

  getFiles(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.certPath, ref =>
      ref.limitToLast(numberItems));
  }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  getAllPolls() : AngularFirestoreCollection<Poll> {
    return this.pollsRef;
  }

  addPollData(poll: any): any {
    const pollRef: AngularFirestoreDocument<any> = this.store.doc(
      `polls/${poll.id}`
    );
    const pollData: Poll = {
      id: poll.id,
      name: poll.name
    };
    return pollRef.set(pollData, {
      merge: true,
    });
  }

  deletePoll(id: string): Promise<void> {
    return this.pollsRef.doc(id).delete();
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.certPath).push(fileUpload);
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.certPath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.certPath);
    storageRef.child(name).delete();
  }
}
