import { Injectable, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, retry, map, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ImportService } from './import.service';

@Injectable()
export class FileDataService {

  file_id: BehaviorSubject<number> = new BehaviorSubject(null);
  file: BehaviorSubject<any> = new BehaviorSubject(null);
  fields: BehaviorSubject<any[]> = new BehaviorSubject([]);
  FSDFields: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor( 
    private router: Router,
    private _snackBar: MatSnackBar,
    private importS: ImportService,
  ) { 
    this.loadData();
  }

  private loadData(){
    this.file_id
        .pipe(filter(id => Number.isInteger(id) ))
        .subscribe(id => {
          this.loadFile();
          this.loadFields();
          this.loadFSDFields();
        });
  }

  private loadFile() {
    this.importS.getFichier(this.file_id.getValue())
          .subscribe(
            (file: any) => this.file.next(file),
            error => {
              this.file.next(null);
              this.snackBar('Fichier introuvable');
              this.router.navigate(['/import'])
            }
          );
  }

  loadFields(onlyMapped: boolean = false) {
    this.importS.getFields(this.file_id.getValue(), onlyMapped)
          .subscribe(
            (fields: any) => this.fields.next(fields),
            error => { 
              if (this.file.getValue() !== null){ 
                this.snackBar('Erreur lors de la récupération des champs');
                this.router.navigate(['/import', 'fichier', this.file_id])
              }
            }
          );
  }

  private loadFSDFields() {
    this.importS.getFSDFields()
          .subscribe(
            (fields: any) => this.FSDFields.next(fields),
            error => { 
              if (this.file.getValue() !== null){ 
                this.snackBar('Erreur lors de la récupération des champs FSD');
                this.router.navigate(['/import', 'fichier', this.file_id])
              }
            }
          );
  }

  snackBar(msg:string, closeMsg:string='Fermer', duration:number=4000, position:'top' | 'bottom'='top'): void {
    this._snackBar.open(msg, closeMsg, {
      duration: duration,
      verticalPosition: position
    });
  }

}


@Injectable()
export class FileService {

  private file_id: BehaviorSubject<number> = new BehaviorSubject(null);
  get file() {
    return this.fileDataS.file;
  }
  get fields() {
    return this.fileDataS.fields;
  }
  get FSDFields() {
    return this.fileDataS.FSDFields;
  }

  constructor( 
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private fileDataS: FileDataService
  ) { 
    this.getFileId();
  }

  private getFileId(){
    let id_fichier = this.route.snapshot.paramMap.get('fichier');

    if ( id_fichier === null || !Number.isInteger(Number(id_fichier)) ) {
      this.snackBar('Fichier introuvable');
      this.router.navigate(['/import']);
    } 

    //On vérifie si l'id de fichier à changé (pour recharger les infos au besoin)
    if ( this.fileDataS.file_id.getValue() !== Number(id_fichier) ) {
      this.fileDataS.file_id.next(Number(id_fichier));
    } 
  }

  refreshFields(onlyMapped: boolean = false){
    this.fileDataS.loadFields(onlyMapped);
    return this.fields;
  }

  snackBar(msg:string, closeMsg:string='Fermer', duration:number=4000, position:'top' | 'bottom'='top'): void {
    this.fileDataS.snackBar(msg, closeMsg, duration, position);
  }
}