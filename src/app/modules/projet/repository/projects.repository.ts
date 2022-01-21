import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Organism, Project, Funder, Signatory, ProjectDeadline, DeadlineType, StudyFunding, ProjectType, RefDay } from './project.interface';

@Injectable()
export class ProjectsRepository extends ApiProjectRepository {


  ////////////////////
  //  CONVENTIONS  //
  ////////////////////
  /** GET list of Project **/
  projects(): Observable<Project[]> {
    const url = `${this.httpUrlBase}/projects`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Project[]) => res), 
        retry(3)
      );
  }

  /** GET one of Project **/
  project(id): Observable<Project> {
    const url = `${this.httpUrlBase}/projects/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Project) => res), 
        retry(3)
      );
  }

  /** GET one of Project **/
  projectFunders(id): Observable<Funder[]> {
    const url = `${this.httpUrlBase}/projects/${id}/funders`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Funder[]) => res), 
        retry(3)
      );
  }

  /** GET one of Project **/
  projectSignatories(id): Observable<Signatory[]> {
    const url = `${this.httpUrlBase}/projects/${id}/signatories`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Signatory[]) => res), 
        retry(3)
      );
  }

  /** GET one of Project **/
  projectStudiesFundings(id): Observable<Signatory[]> {
    const url = `${this.httpUrlBase}/projects/${id}/studies-fundings`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Signatory[]) => res), 
        retry(3)
      );
  }

  /** GET one of Project **/
  projectDeadlines(id): Observable<Signatory[]> {
    const url = `${this.httpUrlBase}/projects/${id}/deadlines`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Signatory[]) => res), 
        retry(3)
      );
  }

  /** POST create new Project **/
  postProjects(data: Project): Observable<Project> {
    const url = `${this.httpUrlBase}/projects`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  ////////////////////
  //  FINANCEURS  //
  ////////////////////
  /** GET list of Project **/
  funders(): Observable<Funder[]> {
    const url = `${this.httpUrlBase}/project-funders`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Funder[]) => res), 
        retry(3)
      );
  }

  /** POST create new Project **/
  postFunders(data: Funder): Observable<Funder> {
    const url = `${this.httpUrlBase}/project-funders`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  ////////////////////
  //  SIGNATAIRES  //
  ////////////////////
  /** GET list of Project **/
  signatories(): Observable<Signatory[]> {
    const url = `${this.httpUrlBase}/project-signatories`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Signatory[]) => res), 
        retry(3)
      );
  }

  /** POST create new Project **/
  postSignatories(data: Signatory): Observable<Signatory> {
    const url = `${this.httpUrlBase}/project-signatories`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  ////////////////////
  //  DEADLINE  //
  ////////////////////
  /** GET list of ProjectDeadline **/
  deadlines(): Observable<ProjectDeadline[]> {
    const url = `${this.httpUrlBase}/project-deadlines`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ProjectDeadline[]) => res), 
        retry(3)
      );
  }

  /** POST create new ProjectDeadline **/
  postDeadlines(data: ProjectDeadline): Observable<ProjectDeadline> {
    const url = `${this.httpUrlBase}/project-deadlines`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** GET list of DeadlineType **/
  deadlineTypes(): Observable<DeadlineType[]> {
    const url = `${this.httpUrlBase}/deadline-types`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: DeadlineType[]) => res), 
        retry(3)
      );
  }

  ///////////////////////
  //  PROJECT FUNDING  //
  ///////////////////////
  /** POST create new StudyFunding **/
  postStudyFunding(data: StudyFunding): Observable<StudyFunding> {
    const url = `${this.httpUrlBase}/study-fundings`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** GET list of Project **/
  projectTypes(params = {}): Observable<ProjectType[]> {
    const url = `${this.httpUrlBase}/project-types`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ProjectType[]) => res), 
        retry(3)
      );
  }

  refDays(params: any = {}): Observable<RefDay[]> {
    const url = `${this.httpUrlBase}/ref-days`;
    // const url = `${this.httpUrlBase}/expenses?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: RefDay[]) => res),
        retry(3)
       );
  }
}