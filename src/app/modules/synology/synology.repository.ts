import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '@shared/app.config';

import { SynologyService } from "./synology.service";

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class SynologyRepository {

	httpUrlBase: string;
  url_synology: string;
  // constructeur ...
  constructor(
    protected http: HttpClient,
    private synologyS: SynologyService, 
  ) {
    this.url_synology = AppConfig.URL_SYNOLOGY;
  }

  connect(user: {login: string, pwd: string}): Observable<any> {
    const http_options = Object.assign({}, HTTP_OPTIONS);
    return this.http.post(`${this.url_synology}/connect`, user, http_options);
  }

  list(folder): Observable<any> {
    const params = {
      "folder_path": folder,
      "additional": '["size", "type", "mount_point_type"]',
      "_sid": this.synologyS.sid,
    };
    const http_options = Object.assign({}, {params: params});
    return this.http.get(`${this.url_synology}/list`, http_options);
  }

  getFileInfo(path): Observable<any> {
    const params = {
      "path": path,
      "additional": '["size", "type", "mount_point_type"]',
      "_sid": this.synologyS.sid,
    };
    const http_options = Object.assign({}, {params: params});
    return this.http.get(`${this.url_synology}/list/info`, http_options);
  }

  info(): Observable<any> {
    const params = {
      "api": "SYNO.FileStation.Info",
      "version": "2",
      "method": "get",
      "_sid": this.synologyS.sid,
    };
    const http_options = Object.assign({}, {params: params});
    return this.http.get(this.url_synology, http_options);
  }

  download(file): Observable<ArrayBuffer> {
    const params = {
      "path": file,
      "_sid": this.synologyS.sid,
    };
    const http_options = Object.assign({}, {params: params, responseType: 'blob' as 'json'});
    return this.http
      .get(`${this.url_synology}/download`, http_options)
      .pipe(
        map((res: ArrayBuffer) => res)
      );
    ;
  }

  upload(
     file: File, 
     fileName: string,
     params: {path?: string, create_parents?: 'true'|'false', overwrite?: 'true'|'false'} = {path: null, create_parents: 'false', overwrite: 'false'}
  ): Observable<any> {

    if (params.path === null) {
      throw 'le paramètre path ne peut être null';
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    formData.append('file', file, fileName);


    return this.http
      .post(`${this.url_synology}/upload`, formData, {
        params: {"_sid": this.synologyS.sid}, 
        reportProgress: true,
        observe: 'events'}
      );
  }

  delete(file): Observable<any> {
    const params = {
      "api": "SYNO.FileStation.Delete",
      "version": "2",
      "method": "delete",
      "path": file,
      "_sid": this.synologyS.sid,
    };
    const http_options = Object.assign({}, {params: params});
    return this.http.get(this.url_synology, http_options);
    ;
  }
}