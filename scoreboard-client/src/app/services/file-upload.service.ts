import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FileUploadService {
  private readonly backendUrl = 'http://localhost:5001';
  private readonly webApiUrl = `${this.backendUrl}/api`;
  private readonly fileUploadApiUrl = `${this.webApiUrl}/fileUpload`;
  private readonly imagesUrl = `${this.backendUrl}/images`;
  private readonly excelUrl = `${this.backendUrl}/excel`;

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.fileUploadApiUrl, formData, {reportProgress: true, observe: 'events'});
  }

  getImageUrl(filename: string) {
    return `${this.imagesUrl}/${filename}`;
  }

  getExcelUrl(filename: string) {
    return `${this.excelUrl}/${filename}`;
  }

}
