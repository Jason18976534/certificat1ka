export class FileUpload {
  key!: string;
  name!: string;
  url!: string;
  expired: boolean = false;
  userId!: string;
  recordNumber!: string;
  status!: string;
  pollId!: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }
}
