import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient) {
  }

  upload(property, file) {
    const url = '/engine/upload.php?property=' + property;
    const formData = new FormData();
    formData.append('Filedata', file);

    return this.http.post(url, formData).pipe(
      take(1),
      map((response) => {
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
